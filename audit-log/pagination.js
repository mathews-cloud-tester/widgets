export const PAGE_SIZE = 50;

/** One page of entries after `cursor`, newest first, and the cursor for the next page. */
export function pageOfEntries(entries, cursor) {
  const sorted = [...entries].sort((a, b) => b.id - a.id);
  const start = cursor === undefined ? 0 : sorted.findIndex((entry) => entry.id < cursor);
  const page = start === -1 ? [] : sorted.slice(start, start + PAGE_SIZE);
  const last = page.at(-1);
  return { page, nextCursor: page.length === PAGE_SIZE && last !== undefined ? last.id : undefined };
}
