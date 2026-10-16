export async function renderSavedSearchesMenu(menu, { runSearch, currentQuery }) {
  const saved = await (await fetch("/api/saved-searches")).json();
  menu.replaceChildren(
    ...saved.map((search) => {
      const item = document.createElement("button");
      item.textContent = search.name;
      item.addEventListener("click", () => runSearch(search.query));
      return item;
    }),
  );
  const save = document.createElement("button");
  save.textContent = "Save this search";
  save.addEventListener("click", async () => {
    const name = prompt("Name this search");
    if (name) {
      await fetch("/api/saved-searches", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, query: currentQuery() }),
      });
    }
  });
  menu.append(save);
}
