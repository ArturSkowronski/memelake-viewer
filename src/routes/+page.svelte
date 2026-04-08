<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchDates, fetchDigest, type DigestArticle } from '$lib/api';
	import { isHidden, save, archive } from '$lib/store.svelte';
	import MemeCard from '$lib/components/MemeCard.svelte';

	let dates = $state<string[]>([]);
	let selectedDate = $state<string>('');
	let memes = $state<DigestArticle[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let focusIndex = $state(0);

	let visibleMemes = $derived(memes.filter((m) => !isHidden(m.id)));

	async function loadDate(date: string) {
		loading = true;
		error = null;
		focusIndex = 0;
		const digest = await fetchDigest(date);
		if (digest) {
			memes = [...digest.unclustered].sort((a, b) => b.engagementScore - a.engagementScore);
		} else {
			memes = [];
			error = 'Failed to load memes for this date.';
		}
		loading = false;
	}

	function handleSave(meme: DigestArticle) {
		save(meme.id, meme);
	}

	function handleArchive(meme: DigestArticle) {
		archive(meme.id, meme);
	}

	function handleKeydown(e: KeyboardEvent) {
		const tag = (e.target as HTMLElement)?.tagName;
		if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;

		if (e.key === 'j' || e.key === 'ArrowDown') {
			e.preventDefault();
			if (focusIndex < visibleMemes.length - 1) focusIndex++;
			scrollToFocused();
		} else if (e.key === 'k' || e.key === 'ArrowUp') {
			e.preventDefault();
			if (focusIndex > 0) focusIndex--;
			scrollToFocused();
		} else if (e.key === 's') {
			const m = visibleMemes[focusIndex];
			if (m) handleSave(m);
		} else if (e.key === 'a') {
			const m = visibleMemes[focusIndex];
			if (m) handleArchive(m);
		}
	}

	function scrollToFocused() {
		const el = document.querySelector('.meme-card.focused');
		el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}

	onMount(async () => {
		dates = await fetchDates();
		if (dates.length > 0) {
			selectedDate = dates[0];
			await loadDate(dates[0]);
		} else {
			loading = false;
			error = 'No dates available.';
		}
	});
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="header">
	<h1>Today's Memes</h1>
	<div class="controls">
		{#if dates.length > 0}
			<select
				bind:value={selectedDate}
				onchange={() => loadDate(selectedDate)}
			>
				{#each dates as d}
					<option value={d}>{d}</option>
				{/each}
			</select>
		{/if}
		{#if !loading}
			<span class="count">{visibleMemes.length} memes</span>
		{/if}
	</div>
</div>

{#if loading}
	<div class="status">Loading...</div>
{:else if error}
	<div class="status error">{error}</div>
{:else if visibleMemes.length === 0}
	<div class="status">No memes to show. All saved or archived!</div>
{:else}
	<div class="feed">
		{#each visibleMemes as meme, i (meme.id)}
			<MemeCard
				{meme}
				focused={i === focusIndex}
				onSave={handleSave}
				onArchive={handleArchive}
			/>
		{/each}
	</div>
{/if}

<div class="shortcuts">
	<kbd>j</kbd>/<kbd>k</kbd> navigate &middot; <kbd>s</kbd> save &middot; <kbd>a</kbd> archive
</div>

<style>
	.header {
		margin-bottom: 1.5rem;
	}

	h1 {
		font-size: 1.5rem;
		font-weight: 700;
		color: #e0e0e0;
		margin-bottom: 0.75rem;
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	select {
		background: #1a1a1a;
		color: #e0e0e0;
		border: 1px solid #333;
		border-radius: 6px;
		padding: 0.4rem 0.75rem;
		font-size: 0.9rem;
		cursor: pointer;
	}

	select:focus {
		outline: none;
		border-color: #4ecdc4;
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

	.status.error {
		color: #f7a072;
	}

	.feed {
		display: flex;
		flex-direction: column;
	}

	.shortcuts {
		text-align: center;
		padding: 2rem 1rem 1rem;
		color: #555;
		font-size: 0.8rem;
	}

	kbd {
		background: #222;
		border: 1px solid #333;
		border-radius: 3px;
		padding: 0.1rem 0.4rem;
		font-family: monospace;
		font-size: 0.75rem;
		color: #aaa;
	}
</style>
