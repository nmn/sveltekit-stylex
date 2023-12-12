<script lang="ts">
	let count = 0;
	const incr = () => count++;
	const decr = () => count--;
</script>

<h1 class={stylex(styles.foo)}>Welcome to SvelteKit</h1>
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
      color: 'red',
    },
  });
</script>