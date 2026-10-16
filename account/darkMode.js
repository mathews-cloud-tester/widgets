const STORAGE_KEY = "theme";

export function applyTheme(choice, prefersDark = matchMedia("(prefers-color-scheme: dark)").matches) {
  const theme = choice === "system" ? (prefersDark ? "dark" : "light") : choice;
  document.documentElement.dataset.theme = theme;
}

export function renderThemeSetting(select) {
  select.value = localStorage.getItem(STORAGE_KEY) ?? "system";
  applyTheme(select.value);
  select.addEventListener("change", () => {
    localStorage.setItem(STORAGE_KEY, select.value);
    applyTheme(select.value);
  });
}
