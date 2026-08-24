const STORAGE_KEY = 'blog:read-articles';

type ReadRecord = Record<string, number>;

function readStore(): ReadRecord {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return {};
		const parsed = JSON.parse(raw);
		if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
			return parsed as ReadRecord;
		}
		return {};
	} catch {
		return {};
	}
}

function writeStore(store: ReadRecord): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
	} catch {
		/* modo privado o almacenamiento lleno: ignorar */
	}
}

export function getReadSlugs(): string[] {
	return Object.keys(readStore());
}

export function isRead(slug: string): boolean {
	return slug in readStore();
}

export function markAsRead(slug: string): void {
	if (!slug) return;
	const store = readStore();
	if (slug in store) return;
	store[slug] = Date.now();
	writeStore(store);
}
