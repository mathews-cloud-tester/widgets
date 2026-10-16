import { pageOfEntries } from "./pagination.js";

export function renderAuditLog(root, entries) {
  let cursor;
  const list = root.querySelector("#audit-log");
  const loadMore = root.querySelector("#load-more");
  function load() {
    const { page, nextCursor } = pageOfEntries(entries, cursor);
    for (const entry of page) {
      const item = document.createElement("li");
      item.textContent = `${entry.at} ${entry.actor}: ${entry.action}`;
      list.append(item);
    }
    cursor = nextCursor;
    loadMore.hidden = nextCursor === undefined;
  }
  loadMore.addEventListener("click", load);
  load();
}
