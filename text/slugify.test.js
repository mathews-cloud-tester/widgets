import { test } from "node:test";
import assert from "node:assert/strict";

import { slugify } from "./slugify.js";

test("lowercases and hyphenates words", () => {
  assert.equal(slugify("Hello World"), "hello-world");
});

test("trims surrounding whitespace", () => {
  assert.equal(slugify("   Widgets  "), "widgets");
});

test("collapses runs of non-alphanumerics into one hyphen", () => {
  assert.equal(slugify("a  --  b__c!!!d"), "a-b-c-d");
});

test("strips leading and trailing hyphens", () => {
  assert.equal(slugify("--Hello, World!--"), "hello-world");
});

test("keeps digits", () => {
  assert.equal(slugify("Version 2.0 Release"), "version-2-0-release");
});

test("returns an empty string when nothing alphanumeric remains", () => {
  assert.equal(slugify("  !!! --- "), "");
  assert.equal(slugify(""), "");
});
