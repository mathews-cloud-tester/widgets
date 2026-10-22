/** Lowercases `text` and joins its alphanumeric runs with single hyphens, e.g. "  Hello, World! " -> "hello-world". */
export function slugify(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
