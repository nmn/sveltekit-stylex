<script lang="ts">
	let count = 0;
	const incr = () => count++;
	const decr = () => count--;
</script>


<h1 {...attrs(styles.title)}>SvelteKit <span {...attrs(styles.emoji)}>♥️</span> StyleX</h1>
<div {...attrs(styles.counter)}>
	<button {...attrs(styles.counter, styles.btn)} on:click={decr}>-</button>
	<span {...attrs(styles.count)}>{count}</span>
	<button {...attrs(styles.counter, styles.btn)} on:click={incr}>+</button>
</div>

<p {...attrs(styles.footer)}>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<script context="module" lang="ts">
	import {create, attrs, keyframes} from '@stylexjs/stylex';
  import {globalTokens} from '../styles/globalTokens.stylex';

  const beat = keyframes({
    '0%': { transform: 'scale(1)' },
    '10%': { transform: 'scale(1.2)' },
    '20%': { transform: 'scale(1)' },
    '30%': { transform: 'scale(1.2)' },
    '40%': { transform: 'scale(1)' },
    '90%': { transform: 'scale(0.95)' },
    '100%': { transform: 'scale(1)' },
  });

  const styles = create({
    title: {
      color: globalTokens.red,
      fontFamily: globalTokens.sans,
      fontSize: '4rem',
      fontWeight: 200,
      marginInline: 'auto',
      width: 'fit-content',
    },
    emoji: {
      display: 'inline-block',
      animationName: beat,
      animationDuration: '2s',
      animationIterationCount: 'infinite',
      animationTimingFunction: 'linear',
    },
    counter: {
      display: 'flex',
      alignItems: 'center',
      fontFamily: globalTokens.sans,
      justifyContent: 'center',
      gap: 32,
      fontSize: '4rem',
      padding: 16,
      fontWeight: 200,
      marginInline: 'auto',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'rgba(0,0,0,0.1)',
      width: 'fit-content',
      borderRadius: 32,
    },
    btn: {
      appearance: 'none',
      borderStyle: 'none',
      borderRadius: 16,
      cursor: 'pointer',
      height: 'calc(4rem + 48px)',
      aspectRatio: 1,
      paddingBottom: '1.5rem',
      backgroundColor: {
        default: 'rgba(0,0,0,0.1)',
        ":hover": 'rgba(0,0,0,0.2)',
      },
      scale: {
        default: 1,
        ":hover": 1.025,
        ':active': 0.975,
      },
      transitionProperty: 'background-color, scale',
      transitionDuration: '0.1s',
      transitionTimingFunction: 'ease-in-out',
    },
    count: {
      textAlign: 'center',
      minWidth: '4rem',
    },
    footer: {
      fontFamily: globalTokens.sans,
      textAlign: 'center',
      marginTop: 64,
    }
  });
</script>