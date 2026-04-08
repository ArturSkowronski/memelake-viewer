<script lang="ts">
	import { page } from '$app/state';
	import { getSavedCount, getArchivedCount } from '$lib/store.svelte';

	let savedCount = $derived(getSavedCount());
	let archivedCount = $derived(getArchivedCount());
</script>

<nav>
	<a href="/" class="brand">Memelake</a>
	<div class="links">
		<a href="/" class:active={page.url.pathname === '/'}>Feed</a>
		<a href="/saved" class:active={page.url.pathname === '/saved'}>
			Saved{#if savedCount > 0}<span class="count">{savedCount}</span>{/if}
		</a>
		<a href="/archive" class:active={page.url.pathname === '/archive'}>
			Archive{#if archivedCount > 0}<span class="count">{archivedCount}</span>{/if}
		</a>
	</div>
</nav>

<style>
	nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1.25rem;
		background: #111;
		border-bottom: 1px solid #222;
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.brand {
		font-size: 1.25rem;
		font-weight: 700;
		color: #4ecdc4;
		text-decoration: none;
	}

	.links {
		display: flex;
		gap: 1rem;
	}

	.links a {
		color: #888;
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 500;
		padding: 0.3rem 0.5rem;
		border-radius: 4px;
		transition:
			color 0.15s,
			background 0.15s;
	}

	.links a:hover {
		color: #e0e0e0;
	}

	.links a.active {
		color: #4ecdc4;
		background: rgba(78, 205, 196, 0.1);
	}

	.count {
		display: inline-block;
		background: #4ecdc4;
		color: #0a0a0a;
		font-size: 0.7rem;
		font-weight: 700;
		padding: 0.1rem 0.4rem;
		border-radius: 10px;
		margin-left: 0.3rem;
		vertical-align: middle;
	}
</style>
