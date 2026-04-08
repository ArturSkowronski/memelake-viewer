<script lang="ts">
	import { getSavedArticles, unsave } from '$lib/store.svelte';
	import MemeCard from '$lib/components/MemeCard.svelte';

	let articles = $derived(getSavedArticles());

	function handleUnsave(id: string) {
		unsave(id);
	}
</script>

<div class="header">
	<h1>Saved Memes</h1>
	<span class="count">{articles.length} saved</span>
</div>

{#if articles.length === 0}
	<div class="status">No saved memes yet. Hit <kbd>s</kbd> on a meme in the feed to save it.</div>
{:else}
	<div class="feed">
		{#each articles as meme (meme.id)}
			<MemeCard {meme} onUnsave={handleUnsave} />
		{/each}
	</div>
{/if}

<style>
	.header {
		display: flex;
		align-items: baseline;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	h1 {
		font-size: 1.5rem;
		font-weight: 700;
		color: #e0e0e0;
	}

	.count {
		color: #888;
		font-size: 0.85rem;
	}

	.status {
		text-align: center;
		padding: 3rem 1rem;
		color: #888;
		font-size: 1.1rem;
	}

	.feed {
		display: flex;
		flex-direction: column;
	}

	:global(kbd) {
		background: #222;
		border: 1px solid #333;
		border-radius: 3px;
		padding: 0.1rem 0.4rem;
		font-family: monospace;
		font-size: 0.75rem;
		color: #aaa;
	}
</style>
