import * as stylex from '@stylexjs/stylex';

const DARK_MODE = '@media (prefers-color-scheme: dark)';

export const globalTokens = stylex.defineVars({
	green: { default: 'green', [DARK_MODE]: 'lightgreen' },
	red: 'red'
});
