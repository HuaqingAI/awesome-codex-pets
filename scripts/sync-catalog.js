#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { discoverPetPackages, readCatalog } from "../src/catalog.js";
import { packageRoot } from "../src/paths.js";

const DEFAULT_CATEGORIES = [
  {
    id: "mascots",
    name: "Mascots",
    description: "Mascot-style pets for tools, teams, and products."
  },
  {
    id: "anime-characters",
    name: "Anime Characters",
    description: "Character-inspired Codex pets."
  },
  {
    id: "animals",
    name: "Animals",
    description: "Animal-inspired Codex pets."
  },
  {
    id: "original-characters",
    name: "Original Characters",
    description: "Original character pets from the community."
  },
  {
    id: "pixel",
    name: "Pixel Pets",
    description: "Pixel-art pets and retro sprites."
  }
];

const CATEGORY_ALIASES = new Map([
  ["anime characters", "anime-characters"],
  ["anime", "anime-characters"],
  ["animals", "animals"],
  ["animal", "animals"],
  ["original characters", "original-characters"],
  ["original character", "original-characters"],
  ["original-pet", "original-characters"],
  ["mascots", "mascots"],
  ["mascot", "mascots"],
  ["pixel pets", "pixel"],
  ["pixel", "pixel"]
]);

if (isCliRun()) {
  syncCatalog()
    .then((result) => {
      console.log(`Synced ${result.petCount} pet(s) to ${result.catalogPath}.`);
    })
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}

export async function syncCatalog({ root = packageRoot() } = {}) {
  const catalog = await readCatalog(root);
  const discoveredCategories = new Map();
  const packages = await discoverPetPackages(root);
  const pets = [];

  for (const petPackage of packages) {
    if (petPackage.manifestError) {
      throw new Error(`${relativePath(root, petPackage.manifestPath)} is missing or invalid: ${petPackage.manifestError.message}`);
    }

    const submission = await readOptionalJson(path.join(petPackage.packageDir, "submission.json"));
    pets.push(buildCatalogEntry({
      catalog,
      discoveredCategories,
      petPackage,
      root,
      submission
    }));
  }

  const categoryOrder = mergeCategories(catalog.categories || [], discoveredCategories);
  const categoryIndex = new Map(categoryOrder.map((category, index) => [category.id, index]));

  catalog.categories = categoryOrder;
  catalog.pets = pets.sort((a, b) => {
    const categoryDelta = (categoryIndex.get(a.category) ?? 999) - (categoryIndex.get(b.category) ?? 999);
    return categoryDelta || a.id.localeCompare(b.id);
  });
  delete catalog.__path;

  const catalogPath = path.join(root, "catalog", "pets.json");
  await fs.writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
  return { catalogPath, petCount: catalog.pets.length };
}

function buildCatalogEntry({ catalog, discoveredCategories, petPackage, root, submission }) {
  const manifest = petPackage.manifest;
  const id = cleanString(manifest.id) || petPackage.dirName;
  if (id !== petPackage.dirName) {
    throw new Error(`${relativePath(root, petPackage.manifestPath)} id must match its directory name.`);
  }

  const category = resolveCategory(submission?.primary_category || manifest.kind, discoveredCategories);
  const entry = {
    id,
    name: cleanString(submission?.name) || cleanString(manifest.displayName) || titleFromId(id),
    description: cleanString(manifest.description) || cleanString(submission?.description),
    category
  };

  const tags = normalizeStringArray(submission?.tags);
  if (tags.length > 0) {
    entry.tags = tags;
  }

  const aliases = normalizeStringArray([
    submission?.pet_slug,
    submission?.slug && submission.slug !== id ? submission.slug : ""
  ]).filter((alias) => alias !== id);
  if (aliases.length > 0) {
    entry.aliases = aliases;
  }

  const author = buildAuthor(submission);
  if (author) {
    entry.author = author;
  }

  entry.url = cleanString(submission?.landing_page)
    || cleanString(submission?.source_url)
    || `${catalog.repository}/tree/main/pets/${id}`;

  return entry;
}

function mergeCategories(existingCategories, discoveredCategories) {
  const existingById = new Map(existingCategories.map((category) => [category.id, category]));
  const categories = DEFAULT_CATEGORIES.map((category) => ({
    ...category,
    ...(existingById.get(category.id) || {})
  }));
  const seen = new Set(categories.map((category) => category.id));

  for (const category of existingCategories) {
    if (!seen.has(category.id)) {
      categories.push(category);
      seen.add(category.id);
    }
  }

  for (const [id, name] of discoveredCategories) {
    if (!seen.has(id)) {
      categories.push({
        id,
        name,
        description: `${name} Codex pets.`
      });
      seen.add(id);
    }
  }

  return categories;
}

function resolveCategory(value, discoveredCategories) {
  const label = cleanString(value) || "Mascots";
  const normalized = label.trim().toLowerCase().replaceAll(/[-_]+/g, " ");
  const known = CATEGORY_ALIASES.get(normalized);
  if (known) {
    return known;
  }

  const id = slugify(label);
  discoveredCategories.set(id, titleFromLabel(label));
  return id;
}

function buildAuthor(submission) {
  const name = cleanString(submission?.author) || cleanString(submission?.author_handle);
  if (!name) {
    return null;
  }

  const url = cleanString(submission?.author_url);
  if (url) {
    return { name, url };
  }
  return { name };
}

async function readOptionalJson(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }
    throw new Error(`${filePath} is invalid JSON: ${error.message}`);
  }
}

function normalizeStringArray(values) {
  return [...new Set(
    (Array.isArray(values) ? values : [values])
      .map(cleanString)
      .filter(Boolean)
  )];
}

function cleanString(value) {
  return String(value ?? "").trim();
}

function slugify(value) {
  const slug = cleanString(value)
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-|-$/g, "");
  return slug || "misc";
}

function titleFromId(id) {
  return titleFromLabel(id.replaceAll("-", " "));
}

function titleFromLabel(value) {
  return cleanString(value)
    .split(/\s+/)
    .map((word) => word ? `${word[0].toUpperCase()}${word.slice(1)}` : "")
    .join(" ");
}

function relativePath(root, filePath) {
  return path.relative(root, filePath).split(path.sep).join("/");
}

function isCliRun() {
  return process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
}
