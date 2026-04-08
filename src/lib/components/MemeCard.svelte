<script lang="ts">
	import type { DigestArticle } from '$lib/api';

	interface Props {
		meme: DigestArticle;
		focused?: boolean;
		onSave?: (meme: DigestArticle) => void;
		onArchive?: (meme: DigestArticle) => void;
		onUnsave?: (id: string) => void;
		onUnarchive?: (id: string) => void;
	}

	let { meme, focused = false, onSave, onArchive, onUnsave, onUnarchive }: Props = $props();

	function stripPrefix(title: string): string {
		return title.replace(/^\[.*?\]\s*/, '');
	}

	function extractSub(title: string): string | null {
		const match = title.match(/^\[([^\]]+)\]/);
		return match ? match[1] : null;
	}

	function formatScore(n: number): string {
		if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
		return n.toString();
	}
</script>

<div class="meme-card" class:focused>
	{#if meme.url}
		<div class="meme-image">
			<img src={meme.url} alt={stripPrefix(meme.title)} loading="lazy" />
		</div>
	{/if}
	<div class="meme-info">
		<p class="caption">{stripPrefix(meme.title)}</p>
		<div class="meta">
			{#if extractSub(meme.title) || meme.handle}
				<span class="badge">{extractSub(meme.title) ?? meme.handle}</span>
			{/if}
			<span class="score">{formatScore(meme.engagementScore)} upvotes</span>
		</div>
		<div class="actions">
			{#if onSave}
				<button class="btn save" onclick={() => onSave?.(meme)}>
					Save
				</button>
			{/if}
			{#if onArchive}
				<button class="btn archive" onclick={() => onArchive?.(meme)}>
					Archive
				</button>
			{/if}
			{#if onUnsave}
				<button class="btn unsave" onclick={() => onUnsave?.(meme.id)}>
					Unsave
				</button>
			{/if}
			{#if onUnarchive}
				<button class="btn unarchive" onclick={() => onUnarchive?.(meme.id)}>
					Unarchive
				</button>
			{/if}
		</div>
	</div>
</div>

<style>
	.meme-card {
		background: #1a1a1a;
		border: 1px solid #2a2a2a;
		border-radius: 12px;
		overflow: hidden;
		transition: border-color 0.2s;
		max-width: 640px;
		margin: 0 auto 1.5rem;
	}

	.meme-card.focused {
		border-color: #4ecdc4;
		box-shadow: 0 0 0 2px rgba(78, 205, 196, 0.3);
	}

	.meme-image {
		width: 100%;
		display: flex;
		justify-content: center;
		background: #111;
	}

	.meme-image img {
		max-width: 100%;
		max-height: 600px;
		object-fit: contain;
		display: block;
	}

	.meme-info {
		padding: 1rem 1.25rem;
	}

	.caption {
		margin: 0 0 0.75rem;
		font-size: 1rem;
		line-height: 1.4;
		color: #e0e0e0;
	}

	.meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
		font-size: 0.85rem;
		color: #888;
	}

	.badge {
		background: #2a2a2a;
		color: #4ecdc4;
		padding: 0.2rem 0.6rem;
		border-radius: 4px;
		font-size: 0.8rem;
		font-weight: 500;
	}

	.score {
		color: #999;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
	}

	.btn {
		padding: 0.4rem 1rem;
		border: 1px solid #333;
		border-radius: 6px;
		background: #222;
		color: #ccc;
		cursor: pointer;
		font-size: 0.85rem;
		transition:
			background 0.15s,
			border-color 0.15s;
	}

	.btn:hover {
		background: #2a2a2a;
		border-color: #4ecdc4;
		color: #fff;
	}

	.btn.save:hover,
	.btn.unsave:hover {
		border-color: #4ecdc4;
		color: #4ecdc4;
	}

	.btn.archive:hover,
	.btn.unarchive:hover {
		border-color: #f7a072;
		color: #f7a072;
	}
</style>
