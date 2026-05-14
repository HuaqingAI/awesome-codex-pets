import fs from "node:fs/promises";
import path from "node:path";
import { STATES } from "./animation.js";
import { packageRoot } from "./paths.js";

const PET_ID_PATTERN = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;

export async function readCatalog(root = packageRoot()) {
  const catalogPath = path.join(root, "catalog", "pets.json");
  const raw = await fs.readFile(catalogPath, "utf8");
  const catalog = JSON.parse(raw);
  catalog.__path = catalogPath;
  return catalog;
}

export function categoryMap(catalog) {
  return new Map((catalog.categories || []).map((category) => [category.id, category]));
}

export function stateMap() {
  return new Map(STATES.map((state) => [state.id, state]));
}

export function findCatalogPet(catalog, idOrAlias) {
  const wanted = String(idOrAlias || "").trim();
  return (catalog.pets || []).find((pet) => {
    if (pet.id === wanted) {
      return true;
    }
    return Array.isArray(pet.aliases) && pet.aliases.includes(wanted);
  });
}

export function petPackagePath(root, pet) {
  return path.join(root, pet.packagePath || path.join("pets", pet.id));
}

export function previewPathForPet(pet, stateId) {
  const base = pet.previewPath || `assets/previews/${pet.id}`;
  return `${base}/${stateId}.gif`;
}

export function displayAuthor(pet) {
  if (!pet.author) {
    return "";
  }
  if (typeof pet.author === "string") {
    return pet.author;
  }
  return pet.author.name || "";
}

export function categoryName(catalog, id) {
  return categoryMap(catalog).get(id)?.name || id;
}

export async function validateCatalog(root = packageRoot()) {
  const errors = [];
  const warnings = [];
  const catalog = await readCatalog(root);
  const categories = categoryMap(catalog);
  const states = stateMap();
  const petIds = new Set();
  const categoryIds = new Set();

  if (!Number.isInteger(catalog.version)) {
    errors.push("catalog.version must be an integer.");
  }

  for (const category of catalog.categories || []) {
    if (!category.id || !PET_ID_PATTERN.test(category.id)) {
      errors.push(`Invalid category id: ${category.id}`);
    }
    if (categoryIds.has(category.id)) {
      errors.push(`Duplicate category id: ${category.id}`);
    }
    categoryIds.add(category.id);
    if (!category.name) {
      errors.push(`Category ${category.id} is missing name.`);
    }
  }

  for (const stateId of catalog.previewStates || []) {
    if (!states.has(stateId)) {
      errors.push(`Unknown preview state in catalog.previewStates: ${stateId}`);
    }
  }

  for (const pet of catalog.pets || []) {
    if (!pet.id || !PET_ID_PATTERN.test(pet.id)) {
      errors.push(`Invalid pet id: ${pet.id}`);
      continue;
    }
    if (petIds.has(pet.id)) {
      errors.push(`Duplicate pet id: ${pet.id}`);
    }
    petIds.add(pet.id);

    if (!pet.name) {
      errors.push(`Pet ${pet.id} is missing name.`);
    }
    if (!pet.category || !categories.has(pet.category)) {
      errors.push(`Pet ${pet.id} has unknown category: ${pet.category}`);
    }

    const packageDir = petPackagePath(root, pet);
    const manifestPath = path.join(packageDir, "pet.json");
    const spritesheetPath = path.join(packageDir, "spritesheet.webp");
    try {
      const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
      if (manifest.id && manifest.id !== pet.id) {
        errors.push(`Pet ${pet.id} manifest id is ${manifest.id}.`);
      }
      if (!manifest.displayName) {
        errors.push(`Pet ${pet.id} manifest is missing displayName.`);
      }
      if (!manifest.spritesheetPath) {
        errors.push(`Pet ${pet.id} manifest is missing spritesheetPath.`);
      }
    } catch (error) {
      errors.push(`Pet ${pet.id} is missing or has invalid pet.json: ${error.message}`);
    }

    try {
      await fs.access(spritesheetPath);
    } catch {
      errors.push(`Pet ${pet.id} is missing spritesheet.webp.`);
    }

    const previewStates = pet.previewStates || catalog.previewStates || [];
    for (const stateId of previewStates) {
      if (!states.has(stateId)) {
        errors.push(`Pet ${pet.id} references unknown preview state: ${stateId}`);
        continue;
      }
      const previewPath = path.join(root, previewPathForPet(pet, stateId));
      try {
        await fs.access(previewPath);
      } catch {
        warnings.push(`Pet ${pet.id} is missing preview GIF for ${stateId}.`);
      }
    }
  }

  return { catalog, errors, warnings };
}
