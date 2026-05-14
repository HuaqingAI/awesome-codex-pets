import fs from "node:fs/promises";
import path from "node:path";
import { findCatalogPet, petPackagePath } from "./catalog.js";
import { activeMarkerPath, assertInside, petsDir, resolveCodexHome } from "./paths.js";

export async function readPetManifest(petDir) {
  const manifestPath = path.join(petDir, "pet.json");
  const raw = await fs.readFile(manifestPath, "utf8");
  return JSON.parse(raw);
}

export async function listInstalledPets(codexHome) {
  const root = petsDir(codexHome);
  let entries = [];
  try {
    entries = await fs.readdir(root, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }

  const pets = [];
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) {
      continue;
    }
    const dir = path.join(root, entry.name);
    try {
      const manifest = await readPetManifest(dir);
      pets.push({
        id: entry.name,
        displayName: manifest.displayName || entry.name,
        description: manifest.description || "",
        dir
      });
    } catch {
      pets.push({
        id: entry.name,
        displayName: entry.name,
        description: "",
        dir,
        invalid: true
      });
    }
  }
  return pets.sort((a, b) => a.id.localeCompare(b.id));
}

export async function installPet({ root, catalog, petId, codexHome, force = false }) {
  const pet = findCatalogPet(catalog, petId);
  if (!pet) {
    throw new Error(`Pet not found in catalog: ${petId}`);
  }

  const sourceDir = petPackagePath(root, pet);
  const sourceManifestPath = path.join(sourceDir, "pet.json");
  const sourceSpritesheetPath = path.join(sourceDir, "spritesheet.webp");
  await fs.access(sourceManifestPath);
  await fs.access(sourceSpritesheetPath);

  const resolvedHome = resolveCodexHome(codexHome);
  const targetRoot = petsDir(resolvedHome);
  const targetDir = path.join(targetRoot, pet.id);
  assertInside(targetRoot, targetDir);

  let existed = false;
  try {
    await fs.access(targetDir);
    existed = true;
  } catch {
    existed = false;
  }

  if (existed && !force) {
    return {
      pet,
      installed: false,
      skipped: true,
      reason: "already-installed",
      targetDir
    };
  }

  await fs.mkdir(targetRoot, { recursive: true });
  if (existed && force) {
    await fs.rm(targetDir, { recursive: true, force: true });
  }
  await fs.cp(sourceDir, targetDir, { recursive: true, force: true });

  return {
    pet,
    installed: true,
    skipped: false,
    targetDir
  };
}

export async function ensureInstalled({ root, catalog, petId, codexHome, force = false }) {
  const resolvedHome = resolveCodexHome(codexHome);
  const targetDir = path.join(petsDir(resolvedHome), petId);
  try {
    await fs.access(path.join(targetDir, "pet.json"));
    await fs.access(path.join(targetDir, "spritesheet.webp"));
    return {
      pet: findCatalogPet(catalog, petId) || { id: petId },
      installed: false,
      skipped: true,
      reason: "already-installed",
      targetDir
    };
  } catch {
    return installPet({ root, catalog, petId, codexHome: resolvedHome, force });
  }
}

export async function applyPet({ root, catalog, petId, codexHome, force = false }) {
  const resolvedHome = resolveCodexHome(codexHome);
  const installResult = await ensureInstalled({
    root,
    catalog,
    petId,
    codexHome: resolvedHome,
    force
  });

  const marker = activeMarkerPath(resolvedHome);
  await fs.mkdir(path.dirname(marker), { recursive: true });
  const resolvedPetId = installResult.pet?.id || petId;
  const payload = {
    id: resolvedPetId,
    packageDir: installResult.targetDir,
    appliedAt: new Date().toISOString(),
    note: "Best-effort marker written by awesome-codex-pets. Some Codex Desktop builds still require selecting the pet in the UI."
  };
  await fs.writeFile(marker, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  const stateUpdate = await updateKnownCodexStateKeys(resolvedHome, resolvedPetId);

  return {
    ...installResult,
    marker,
    stateUpdate
  };
}

async function updateKnownCodexStateKeys(codexHome, petId) {
  const statePath = path.join(resolveCodexHome(codexHome), ".codex-global-state.json");
  let raw;
  try {
    raw = await fs.readFile(statePath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      return { statePath, updatedKeys: [], reason: "state-file-not-found" };
    }
    throw error;
  }

  let state;
  try {
    state = JSON.parse(raw);
  } catch {
    return { statePath, updatedKeys: [], reason: "state-file-invalid-json" };
  }

  const persisted = state["electron-persisted-atom-state"];
  if (!persisted || typeof persisted !== "object") {
    return { statePath, updatedKeys: [], reason: "persisted-state-not-found" };
  }

  const knownKeys = [
    "codex-pets:active-pet-id",
    "codex-pet:active-pet-id",
    "codex:active-pet-id",
    "active-pet-id",
    "selected-pet-id"
  ];
  const updatedKeys = [];
  for (const key of knownKeys) {
    if (Object.prototype.hasOwnProperty.call(persisted, key)) {
      persisted[key] = petId;
      updatedKeys.push(key);
    }
  }

  if (updatedKeys.length > 0) {
    await fs.writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
  }

  return {
    statePath,
    updatedKeys,
    reason: updatedKeys.length > 0 ? "updated" : "no-known-state-key"
  };
}
