<script lang="ts"> 
	let count = $state(0);
	const incr = () => count++;
	const decr = () => count--;
</script>


<h1 class={stylex(styles.foo)}>SvelteKit ♥️ StyleX</h1>
<div>
	<button on:click={decr}>-</button>
	{count}
	<button on:click={incr}>+</button>
</div>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<script context="module" lang="ts">
	import stylex from '@stylexjs/stylex';

  const styles = stylex.create({
    foo: {
      color: 'tomato',
      fontFamily: 'system-ui, sans-serif',
      fontWeight: 200,
      fontSize: '4rem',
    },
  });
</script>