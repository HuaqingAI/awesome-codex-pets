import { constants as fsConstants } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { findCatalogPet, petPackagePath } from "./catalog.js";
import { activeMarkerPath, assertInside, petsDir, resolveCodexHome } from "./paths.js";

export const KNOWN_PET_STATE_KEYS = Object.freeze([
  "selected-avatar-id",
  "codex-pets:active-pet-id",
  "codex-pet:active-pet-id",
  "codex:active-pet-id",
  "active-pet-id",
  "selected-pet-id"
]);

export async function readPetManifest(petDir) {
  const manifestPath = path.join(petDir, "pet.json");
  const raw = await fs.readFile(manifestPath, "utf8");
  return parseJson(raw);
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
    const manifestPath = path.join(dir, "pet.json");
    const spritesheetPath = path.join(dir, "spritesheet.webp");
    const issues = [];
    let manifest = null;

    try {
      manifest = parseJson(await fs.readFile(manifestPath, "utf8"));
    } catch (error) {
      issues.push(error.code === "ENOENT"
        ? "missing pet.json"
        : `invalid pet.json: ${error.message}`);
    }

    try {
      await fs.access(spritesheetPath);
    } catch (error) {
      issues.push(error.code === "ENOENT"
        ? "missing spritesheet.webp"
        : `unreadable spritesheet.webp: ${error.message}`);
    }

    pets.push({
      id: entry.name,
      displayName: manifest?.displayName || entry.name,
      description: manifest?.description || "",
      dir,
      manifestPath,
      spritesheetPath,
      invalid: issues.length > 0,
      issues
    });
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
  let complete = false;
  try {
    await fs.access(targetDir);
    existed = true;
  } catch {
    existed = false;
  }

  if (existed) {
    try {
      await fs.access(path.join(targetDir, "pet.json"));
      await fs.access(path.join(targetDir, "spritesheet.webp"));
      complete = true;
    } catch {
      complete = false;
    }
  }

  if (existed && complete && !force) {
    return {
      pet,
      installed: false,
      skipped: true,
      reason: "already-installed",
      targetDir
    };
  }

  await fs.mkdir(targetRoot, { recursive: true });
  if (existed) {
    await fs.rm(targetDir, { recursive: true, force: true });
  }
  await fs.cp(sourceDir, targetDir, { recursive: true, force: true });

  return {
    pet,
    installed: true,
    skipped: false,
    repaired: existed && !complete && !force,
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

export async function diagnoseCodexPets(codexHome) {
  const resolvedHome = resolveCodexHome(codexHome);
  const installedPets = await listInstalledPets(resolvedHome);
  const activeMarker = await readActiveMarker(resolvedHome);
  const codexState = await inspectCodexState(resolvedHome);
  const errors = [];
  const warnings = [];

  for (const pet of installedPets) {
    for (const issue of pet.issues || []) {
      errors.push(`${pet.id}: ${issue}`);
    }
  }

  if (installedPets.length === 0) {
    warnings.push("No installed pet directories found.");
  }

  if (!activeMarker.exists) {
    warnings.push("No active pet marker found.");
  } else if (!activeMarker.readable) {
    errors.push(`Active marker is not readable: ${activeMarker.error}`);
  } else if (!activeMarker.validJson) {
    errors.push(`Active marker is not valid JSON: ${activeMarker.error}`);
  } else {
    for (const issue of activeMarker.issues) {
      warnings.push(`Active marker: ${issue}`);
    }
  }

  if (!codexState.exists) {
    warnings.push("Codex global state file was not found.");
  } else if (!codexState.readable) {
    errors.push(`Codex global state file is not readable: ${codexState.error}`);
  } else if (!codexState.validJson) {
    errors.push(`Codex global state file is not valid JSON: ${codexState.error}`);
  } else if (!codexState.hasPersistedState) {
    warnings.push("Codex global state does not contain electron-persisted-atom-state.");
  } else if (codexState.knownKeys.length === 0) {
    warnings.push("No known Codex pet-selection state key found.");
  } else if (!codexState.writable) {
    warnings.push(`Known pet-selection key exists but the state file is not writable: ${codexState.writeError}`);
  }

  return {
    codexHome: resolvedHome,
    petsDir: petsDir(resolvedHome),
    installedPets,
    activeMarker,
    codexState,
    knownPetSelectionKeyExists: codexState.knownKeys.length > 0,
    errors,
    warnings
  };
}

export async function readActiveMarker(codexHome) {
  const markerPath = activeMarkerPath(codexHome);
  let raw;
  try {
    raw = await fs.readFile(markerPath, "utf8");
  } catch (error) {
    return {
      path: markerPath,
      exists: error.code !== "ENOENT",
      readable: false,
      validJson: false,
      contents: null,
      issues: [],
      error: error.code === "ENOENT" ? "active marker not found" : error.message
    };
  }

  let contents;
  try {
    contents = parseJson(raw);
  } catch (error) {
    return {
      path: markerPath,
      exists: true,
      readable: true,
      validJson: false,
      contents: null,
      issues: [],
      error: error.message
    };
  }

  const issues = [];
  if (!contents || typeof contents !== "object" || Array.isArray(contents)) {
    issues.push("marker must be a JSON object");
  } else {
    if (!contents.id) {
      issues.push("missing id");
    }
    if (!contents.packageDir) {
      issues.push("missing packageDir");
    } else {
      try {
        await fs.access(contents.packageDir);
      } catch {
        issues.push(`packageDir does not exist: ${contents.packageDir}`);
      }
    }
  }

  return {
    path: markerPath,
    exists: true,
    readable: true,
    validJson: true,
    contents,
    issues,
    error: null
  };
}

export async function inspectCodexState(codexHome) {
  const statePath = codexGlobalStatePath(codexHome);
  let raw;
  try {
    raw = await fs.readFile(statePath, "utf8");
  } catch (error) {
    return {
      statePath,
      exists: error.code !== "ENOENT",
      readable: false,
      writable: false,
      validJson: false,
      hasPersistedState: false,
      knownKeys: [],
      reason: error.code === "ENOENT" ? "state-file-not-found" : "state-file-not-readable",
      error: error.code === "ENOENT" ? null : error.message
    };
  }

  let writable = false;
  let writeError = null;
  try {
    await fs.access(statePath, fsConstants.W_OK);
    writable = true;
  } catch (error) {
    writeError = error.message;
  }

  let state;
  try {
    state = parseJson(raw);
  } catch (error) {
    return {
      statePath,
      exists: true,
      readable: true,
      writable,
      writeError,
      validJson: false,
      hasPersistedState: false,
      knownKeys: [],
      reason: "state-file-invalid-json",
      error: error.message
    };
  }

  const persisted = state["electron-persisted-atom-state"];
  const hasPersistedState = Boolean(persisted && typeof persisted === "object" && !Array.isArray(persisted));
  const knownKeys = hasPersistedState
    ? KNOWN_PET_STATE_KEYS
      .filter((key) => Object.prototype.hasOwnProperty.call(persisted, key))
      .map((key) => ({ key, value: persisted[key] }))
    : [];

  return {
    statePath,
    exists: true,
    readable: true,
    writable,
    writeError,
    validJson: true,
    hasPersistedState,
    knownKeys,
    reason: knownKeys.length > 0 ? "known-state-key-found" : "no-known-state-key",
    error: null
  };
}

export function codexGlobalStatePath(codexHome) {
  return path.join(resolveCodexHome(codexHome), ".codex-global-state.json");
}

async function updateKnownCodexStateKeys(codexHome, petId) {
  const statePath = codexGlobalStatePath(codexHome);
  let raw;
  try {
    raw = await fs.readFile(statePath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      return { statePath, updatedKeys: [], knownKeys: [], reason: "state-file-not-found" };
    }
    return {
      statePath,
      updatedKeys: [],
      knownKeys: [],
      reason: "state-file-not-readable",
      error: error.message
    };
  }

  let state;
  try {
    state = parseJson(raw);
  } catch {
    return { statePath, updatedKeys: [], knownKeys: [], reason: "state-file-invalid-json" };
  }

  const persisted = state["electron-persisted-atom-state"];
  if (!persisted || typeof persisted !== "object") {
    return { statePath, updatedKeys: [], knownKeys: [], reason: "persisted-state-not-found" };
  }

  const updatedKeys = [];
  for (const key of KNOWN_PET_STATE_KEYS) {
    if (Object.prototype.hasOwnProperty.call(persisted, key)) {
      persisted[key] = petStateValueForKey(key, petId);
      updatedKeys.push(key);
    }
  }

  if (updatedKeys.length > 0) {
    try {
      await fs.writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
    } catch (error) {
      return {
        statePath,
        updatedKeys: [],
        knownKeys: updatedKeys,
        reason: "state-file-not-writable",
        error: error.message
      };
    }
  }

  return {
    statePath,
    updatedKeys,
    knownKeys: updatedKeys,
    reason: updatedKeys.length > 0 ? "updated" : "no-known-state-key"
  };
}

function parseJson(raw) {
  return JSON.parse(raw.replace(/^\uFEFF/, ""));
}

function petStateValueForKey(key, petId) {
  if (key === "selected-avatar-id") {
    return `custom:${petId}`;
  }
  return petId;
}
