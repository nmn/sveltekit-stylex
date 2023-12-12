import babel from '@babel/core';
import stylexBabelPlugin from '@stylexjs/babel-plugin';
import path from 'path';
import crypto from 'crypto';

export default function styleXVitePlugin({
	unstable_moduleResolution = { type: 'commonJS', rootDir: process.cwd() },
	stylexImports = ['@stylexjs/stylex'],
	...options
} = {}) {
	let stylexRules = {};
	let isProd = false;
	let assetsDir = 'assets';
	let publicBasePath = '/';
	let lastStyleXCSS = {
		id: 0,
		css: ''
	};

	let outputFileName = null;

	const VIRTUAL_STYLEX_MODULE_ID = 'virtual:stylex.css';
	const RESOLVED_STYLEX_MODULE_ID = '\0' + VIRTUAL_STYLEX_MODULE_ID;

	let server;

	let hasRemix = false;

	let reloadCount = 0;
	function reloadStyleX() {
		reloadCount++;

		if (!server) {
			return;
		}

		const module = server.moduleGraph.getModuleById(RESOLVED_STYLEX_MODULE_ID);

		if (!module) {
			return;
		}

		server.moduleGraph.invalidateModule(module);
		server.reloadModule(module);
	}

	function compileStyleX() {
		if (reloadCount === lastStyleXCSS.id) {
			return lastStyleXCSS.css;
		}

		const rules = Object.values(stylexRules).flat();

		if (rules.length === 0) {
			return '';
		}

		const stylexCSS = stylexBabelPlugin.processStylexRules(rules, false);

		lastStyleXCSS = {
			id: reloadCount,
			css: stylexCSS
		};

		return stylexCSS;
	}

	return {
		name: 'vite-plugin-stylex',

		config(config, env) {
			isProd = env.mode === 'production' || config.mode === 'production';
			assetsDir = config.build?.assetsDir || 'assets';
			publicBasePath = config.base || '/';
			hasRemix =
				config.plugins?.flat().some((p) => p && 'name' in p && p.name.includes('remix')) ?? false;
		},

		buildStart() {
			stylexRules = {};
		},

		configureServer(_server) {
			server = _server;
			server.middlewares.use((req, res, next) => {
				// console.log("MIDDLEWARE", req.originalUrl);
				// maybe better way to do this?
				if (/virtual:stylex\.css/.test(req.originalUrl)) {
					res.setHeader('Content-Type', 'text/css');
					const stylexBundle = compileStyleX();
					console.log('SERVE Stylex bundle');
					console.log('====================');
					console.log(stylexBundle);
					console.log('====================');
					res.end(stylexBundle);
					return;
				}
				next();
			});
		},

		resolveId(id) {
			if (id === VIRTUAL_STYLEX_MODULE_ID) {
				return RESOLVED_STYLEX_MODULE_ID;
			}
		},

		load(id) {
			if (
				id === RESOLVED_STYLEX_MODULE_ID ||
				id === VIRTUAL_STYLEX_MODULE_ID ||
				id.endsWith('stylex.css')
			) {
				return compileStyleX();
			}
		},

		shouldTransformCachedModule({ id, meta }) {
			stylexRules[id] = meta.stylex;
			return false;
		},

		generateBundle() {
			const stylexCSS = compileStyleX();

			const hash = crypto.createHash('sha1').update(stylexCSS).digest('hex').slice(0, 8);

			outputFileName = path.join(assetsDir, `stylex.${hash}.css`);

			this.emitFile({
				fileName: outputFileName,
				source: stylexCSS,
				type: 'asset'
			});
		},

		async transform(inputCode, id, { ssr: isSSR } = {}) {
			if (!stylexImports.some((importName) => inputCode.includes(importName))) {
				return;
			}

			const isJSLikeFile =
				id.endsWith('.js') ||
				id.endsWith('.jsx') ||
				id.endsWith('.ts') ||
				id.endsWith('.tsx') ||
				id.endsWith('.svelte');

			if (!isJSLikeFile) {
				return;
			}

			const isCompileMode = isProd || isSSR || hasRemix;

			const result = await babel.transformAsync(inputCode, {
				babelrc: false,
				filename: id + '.ts',
				plugins: [
					[
						stylexBabelPlugin,
						{
							dev: !isProd,
							unstable_moduleResolution,
							importSources: stylexImports,
							runtimeInjection: !isCompileMode,
							...options
						}
					]
				]
			});

			if (!result) {
				return;
			}

			let { code, map, metadata } = result;

			if (isProd) {
				code = 'import "virtual:stylex.css";\n' + code;
			}

			if (isCompileMode && metadata?.stylex != null && metadata?.stylex.length > 0) {
				stylexRules[id] = metadata.stylex;
				reloadStyleX();
			}

			return { code: code ?? undefined, map, meta: metadata };
		},

		transformIndexHtml(html, ctx) {
			if (!isProd || !outputFileName) {
				return html;
			}

			const asset = ctx.bundle?.[outputFileName];

			if (!asset) {
				return html;
			}

			const { fileName } = asset;
			const publicPath = path.join(publicBasePath, fileName);

			return [
				{
					tag: 'link',
					attrs: {
						rel: 'stylesheet',
						href: publicPath
					},
					injectTo: 'head'
				},
				{
					tag: 'link',
					attrs: {
						rel: 'stylesheet',
						href: 'virtual:stylex.css'
					},
					injectTo: 'head'
				}
			];
		}
	};
}
