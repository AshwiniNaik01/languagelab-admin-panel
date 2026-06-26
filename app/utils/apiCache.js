// Simple in-memory cache for API calls — avoids duplicate requests for the same data
// (e.g. topics list is fetched by every module form independently)

const cache = new Map();
const TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function cachedFetch(key, fetcher) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < TTL_MS) return hit.data;
  const data = await fetcher();
  cache.set(key, { data, ts: Date.now() });
  return data;
}

export function invalidateCache(key) {
  if (key) cache.delete(key);
  else cache.clear();
}
