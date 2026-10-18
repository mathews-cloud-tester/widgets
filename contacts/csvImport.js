/** Contacts from a CSV with a header row naming at least `email`; rows without one are returned as rejected. */
export function parseContactsCsv(text) {
  const [header, ...lines] = text.trim().split(/\r?\n/);
  const columns = header.split(",").map((column) => column.trim().toLowerCase());
  const contacts = [];
  const rejected = [];
  lines.forEach((line, index) => {
    const values = line.split(",").map((value) => value.trim());
    const row = Object.fromEntries(columns.map((column, i) => [column, values[i] ?? ""]));
    if (row.email === undefined || row.email === "") {
      rejected.push({ line: index + 2, reason: "no email" });
    } else {
      contacts.push({ name: row.name ?? "", email: row.email, company: row.company ?? "" });
    }
  });
  return { contacts, rejected };
}
