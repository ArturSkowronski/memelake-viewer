<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<Nav />
<main>
	{@render children()}
</main>

<style>
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(html) {
		background: #0a0a0a;
		color: #e0e0e0;
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		-webkit-font-smoothing: antialiased;
	}

	:global(body) {
		min-height: 100vh;
		background: #0a0a0a;
	}

	main {
		max-width: 720px;
		margin: 0 auto;
		padding: 1.5rem 1rem;
	}

	@media (max-width: 480px) {
		main {
			padding: 1rem 0.5rem;
		}
	}
</style>
