import { browser } from '$app/environment';
import type { DigestArticle } from './api';

interface MemelakeState {
	saved: string[];
	archived: string[];
	articles: Record<string, DigestArticle>;
}

function loadState(): MemelakeState {
	if (!browser) return { saved: [], archived: [], articles: {} };
	try {
		const raw = localStorage.getItem('memelake');
		if (raw) {
			const parsed = JSON.parse(raw);
			return {
				saved: parsed.saved ?? [],
				archived: parsed.archived ?? [],
				articles: parsed.articles ?? {}
			};
		}
	} catch {
		// ignore
	}
	return { saved: [], archived: [], articles: {} };
}

function persist(state: MemelakeState) {
	if (browser) localStorage.setItem('memelake', JSON.stringify(state));
}

const initial = loadState();
let saved = $state<string[]>(initial.saved);
let archived = $state<string[]>(initial.archived);
let articles = $state<Record<string, DigestArticle>>(initial.articles);

export function isSaved(id: string): boolean {
	return saved.includes(id);
}
export function isArchived(id: string): boolean {
	return archived.includes(id);
}
export function isHidden(id: string): boolean {
	return saved.includes(id) || archived.includes(id);
}

export function save(id: string, article?: DigestArticle) {
	if (!saved.includes(id)) saved = [...saved, id];
	archived = archived.filter((x) => x !== id);
	if (article) articles = { ...articles, [id]: article };
	persist({ saved, archived, articles });
}

export function archive(id: string, article?: DigestArticle) {
	if (!archived.includes(id)) archived = [...archived, id];
	saved = saved.filter((x) => x !== id);
	if (article) articles = { ...articles, [id]: article };
	persist({ saved, archived, articles });
}

export function unsave(id: string) {
	saved = saved.filter((x) => x !== id);
	const { [id]: _, ...rest } = articles;
	articles = rest;
	persist({ saved, archived, articles });
}

export function unarchive(id: string) {
	archived = archived.filter((x) => x !== id);
	const { [id]: _, ...rest } = articles;
	articles = rest;
	persist({ saved, archived, articles });
}

export function getSavedIds(): string[] {
	return saved;
}
export function getArchivedIds(): string[] {
	return archived;
}
export function getSavedArticles(): DigestArticle[] {
	return saved.map((id) => articles[id]).filter(Boolean) as DigestArticle[];
}
export function getArchivedArticles(): DigestArticle[] {
	return archived.map((id) => articles[id]).filter(Boolean) as DigestArticle[];
}
export function getSavedCount(): number {
	return saved.length;
}
export function getArchivedCount(): number {
	return archived.length;
}
