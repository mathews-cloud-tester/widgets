#!/usr/bin/env node
/**
 * Converts a CSV file to a JSON array of objects.
 *
 * Reads the entire input file into memory in one go (no streaming or
 * chunked parsing), treats the first row as the header row, and emits one
 * JSON object per subsequent row keyed by those headers.
 *
 * CLI usage:
 *   node scripts/csv-to-json.js <input.csv> [output.json]
 *
 * If no output path is given, the resulting JSON is printed to stdout.
 *
 * Programmatic usage:
 *   const { csvToJson } = require("./scripts/csv-to-json.js");
 *   const records = csvToJson(csvString);
 */

const fs = require("node:fs");
const path = require("node:path");

/**
 * Parses raw CSV text into an array of row arrays, honoring quoted fields
 * (including embedded commas, newlines, and escaped double quotes).
 */
function parseCsv(content) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];

    if (inQuotes) {
      if (char === '"') {
        if (content[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && content[i + 1] === "\n") {
        i++;
      }
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => !(r.length === 1 && r[0] === ""));
}

/**
 * Converts a full CSV string into an array of plain objects keyed by the
 * header row's column names.
 */
function csvToJson(csvContent) {
  const rows = parseCsv(csvContent);
  if (rows.length === 0) {
    return [];
  }

  const [headers, ...dataRows] = rows;

  return dataRows.map((row) => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] ?? "";
    });
    return obj;
  });
}

function main() {
  const [, , inputPath, outputPath] = process.argv;

  if (!inputPath) {
    console.error("Usage: node scripts/csv-to-json.js <input.csv> [output.json]");
    process.exit(1);
  }

  const resolvedInput = path.resolve(inputPath);
  // Read the whole file into memory at once rather than streaming it.
  const csvContent = fs.readFileSync(resolvedInput, "utf8");
  const json = csvToJson(csvContent);
  const output = JSON.stringify(json, null, 2);

  if (outputPath) {
    fs.writeFileSync(path.resolve(outputPath), output + "\n", "utf8");
    console.log(`Wrote ${json.length} record(s) to ${outputPath}`);
  } else {
    console.log(output);
  }
}

if (require.main === module) {
  main();
}

module.exports = { csvToJson, parseCsv };
