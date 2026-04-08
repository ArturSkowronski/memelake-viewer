const API_BASE = 'https://vived-engine.fly.dev/api/memelake';

export interface DigestArticle {
	id: string;
	title: string;
	url: string | null;
	summary: string;
	engagementScore: number;
	sourceType: string;
	handle: string | null;
	publishedAt: string;
	ingestedAt: string;
}

export interface DigestJson {
	date: string;
	generatedAt: string;
	totalArticles: number;
	clusters: unknown[];
	unclustered: DigestArticle[];
}

export async function fetchDates(): Promise<string[]> {
	const res = await fetch(`${API_BASE}/dates`);
	if (!res.ok) return [];
	return res.json();
}

export async function fetchDigest(date: string): Promise<DigestJson | null> {
	const res = await fetch(`${API_BASE}/daily/${date}`);
	if (!res.ok) return null;
	return res.json();
}
