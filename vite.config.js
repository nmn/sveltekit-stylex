import { sveltekit } from '@sveltejs/kit/vite';
import styleX from './vite-stylex-plugin/index.mjs';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), styleX()]
};

export default config;
