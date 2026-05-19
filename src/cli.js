import path from "node:path";
import { readFile } from "node:fs/promises";
import {
  categoryName,
  displayAuthor,
  findCatalogPet,
  readCatalog,
  validateCatalog
} from "./catalog.js";
import { applyPet, diagnoseCodexPets, installPet, listInstalledPets } from "./codex.js";
import { activeMarkerPath, packageRoot, petsDir, resolveCodexHome } from "./paths.js";

const root = packageRoot();

export async function runCli(argv) {
  const [command = "help", ...rest] = argv;
  const parsed = parseArgs(rest);

  if (parsed.flags.help || command === "help" || command === "-h" || command === "--help") {
    printHelp();
    return;
  }

  if (command === "version" || command === "--version" || command === "-v") {
    const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
    console.log(packageJson.version);
    return;
  }

  switch (command) {
    case "list":
      await listCommand(parsed);
      return;
    case "show":
      await showCommand(parsed);
      return;
    case "install":
      await installCommand(parsed);
      return;
    case "apply":
      await applyCommand(parsed);
      return;
    case "doctor":
      await doctorCommand(parsed);
      return;
    case "where":
      await whereCommand(parsed);
      return;
    case "validate":
      await validateCommand(parsed);
      return;
    default:
      throw new Error(`Unknown command: ${command}. Run "npx awesome-codex-pets help".`);
  }
}

function parseArgs(args) {
  const flags = {};
  const positionals = [];

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg.startsWith("--")) {
      positionals.push(arg);
      continue;
    }

    const [rawKey, inlineValue] = arg.slice(2).split("=", 2);
    const key = rawKey.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
    if (inlineValue !== undefined) {
      flags[key] = inlineValue;
      continue;
    }

    const next = args[index + 1];
    if (next && !next.startsWith("--") && !["json", "force", "apply", "installed", "help"].includes(key)) {
      flags[key] = next;
      index += 1;
    } else {
      flags[key] = true;
    }
  }

  return { flags, positionals };
}

async function listCommand({ flags }) {
  const codexHome = resolveCodexHome(flags.codexHome);
  if (flags.installed) {
    const pets = await listInstalledPets(codexHome);
    if (flags.json) {
      console.log(JSON.stringify({ codexHome, pets }, null, 2));
      return;
    }
    console.log(`Installed Codex pets in ${petsDir(codexHome)}`);
    if (pets.length === 0) {
      console.log("No installed pets found.");
      return;
    }
    printRows(pets.map((pet) => [pet.id, pet.displayName, pet.invalid ? "invalid" : "ok", pet.dir]));
    return;
  }

  const catalog = await readCatalog(root);
  let pets = catalog.pets || [];
  if (flags.category) {
    pets = pets.filter((pet) => pet.category === flags.category);
  }

  if (flags.json) {
    console.log(JSON.stringify({ pets }, null, 2));
    return;
  }

  if (pets.length === 0) {
    console.log("No pets in catalog yet. Add packages under pets/ and entries in catalog/pets.json.");
    return;
  }

  printRows(
    pets.map((pet) => [
      pet.id,
      pet.name,
      categoryName(catalog, pet.category),
      displayAuthor(pet) || "-"
    ]),
    ["ID", "Name", "Category", "Author"]
  );
}

async function showCommand({ flags, positionals }) {
  const petId = positionals[0];
  if (!petId) {
    throw new Error("Usage: awesome-codex-pets show <pet-id>");
  }
  const catalog = await readCatalog(root);
  const pet = findCatalogPet(catalog, petId);
  if (!pet) {
    throw new Error(`Pet not found in catalog: ${petId}`);
  }
  if (flags.json) {
    console.log(JSON.stringify(pet, null, 2));
    return;
  }
  console.log(`${pet.name} (${pet.id})`);
  console.log(`Category: ${categoryName(catalog, pet.category)}`);
  console.log(`Author: ${displayAuthor(pet) || "-"}`);
  if (pet.description) {
    console.log(`Description: ${pet.description}`);
  }
}

async function installCommand({ flags, positionals }) {
  const petId = positionals[0];
  if (!petId) {
    throw new Error("Usage: awesome-codex-pets install <pet-id|all> [--force] [--apply] [--codex-home <path>]");
  }

  const catalog = await readCatalog(root);
  const codexHome = resolveCodexHome(flags.codexHome);
  const force = Boolean(flags.force);
  const ids = petId === "all" ? (catalog.pets || []).map((pet) => pet.id) : [petId];
  if (ids.length === 0) {
    console.log("No pets in catalog yet.");
    return;
  }

  const results = [];
  for (const id of ids) {
    const result = await installPet({ root, catalog, petId: id, codexHome, force });
    results.push(result);
    if (!flags.json) {
      printInstallResult(result, { showNextStep: !flags.apply });
    }
  }

  if (flags.apply) {
    if (ids.length !== 1) {
      throw new Error("--apply can only be used when installing one pet.");
    }
    const result = await applyPet({ root, catalog, petId: ids[0], codexHome, force });
    if (!flags.json) {
      printApplyResult(result);
    } else {
      results.push({ apply: result });
    }
  }

  if (flags.json) {
    console.log(JSON.stringify(results, null, 2));
  }
}

async function applyCommand({ flags, positionals }) {
  const petId = positionals[0];
  if (!petId) {
    throw new Error("Usage: awesome-codex-pets apply <pet-id> [--force] [--codex-home <path>]");
  }
  const catalog = await readCatalog(root);
  const codexHome = resolveCodexHome(flags.codexHome);
  const result = await applyPet({
    root,
    catalog,
    petId,
    codexHome,
    force: Boolean(flags.force)
  });

  if (flags.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  printInstallResult(result, { showNextStep: false });
  printApplyResult(result);
}

async function doctorCommand({ flags }) {
  const codexHome = resolveCodexHome(flags.codexHome);
  const result = await diagnoseCodexPets(codexHome);

  if (flags.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  printDoctorResult(result);
  if (result.errors.length > 0) {
    process.exitCode = 1;
  }
}

async function whereCommand({ flags }) {
  const codexHome = resolveCodexHome(flags.codexHome);
  const payload = {
    packageRoot: root,
    catalog: path.join(root, "catalog", "pets.json"),
    codexHome,
    petsDir: petsDir(codexHome),
    activeMarker: activeMarkerPath(codexHome),
    codexGlobalState: path.join(codexHome, ".codex-global-state.json")
  };
  if (flags.json) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }
  for (const [key, value] of Object.entries(payload)) {
    console.log(`${key}: ${value}`);
  }
}

async function validateCommand({ flags }) {
  const result = await validateCatalog(root);
  if (flags.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  for (const warning of result.warnings) {
    console.warn(`warning: ${warning}`);
  }
  if (result.errors.length > 0) {
    for (const error of result.errors) {
      console.error(`error: ${error}`);
    }
    throw new Error(`Catalog validation failed with ${result.errors.length} error(s).`);
  }
  console.log("Catalog validation passed.");
}

function printInstallResult(result, { showNextStep = false } = {}) {
  if (result.skipped) {
    console.log(`${result.pet.id}: already installed at ${result.targetDir}`);
    if (showNextStep) {
      printEnableCommand(result.pet.id);
    }
    return;
  }
  if (result.installed) {
    const action = result.repaired ? "repaired installation at" : "installed to";
    console.log(`${result.pet.id}: ${action} ${result.targetDir}`);
    if (showNextStep) {
      printEnableCommand(result.pet.id);
    }
  }
}

function printApplyResult(result) {
  const petId = result.pet.id;
  console.log(`${petId}: active marker written to ${result.marker}`);
  if (result.stateUpdate?.updatedKeys?.length) {
    console.log(`${petId}: updated Codex state key(s): ${result.stateUpdate.updatedKeys.join(", ")}`);
  } else {
    const reason = describeStateUpdateReason(result.stateUpdate?.reason);
    console.log(`${petId}: Codex persisted pet selection was not updated (${reason}).`);
  }
  console.log(`${petId}: apply is best-effort; Codex Desktop may still require manual selection.`);
  printManualActivationGuidance(petId);
}

function printDoctorResult(result) {
  console.log("Codex pets doctor");
  console.log(`CODEX_HOME: ${result.codexHome}`);
  console.log(`Pets directory: ${result.petsDir}`);
  console.log("");

  console.log("Installed pets:");
  if (result.installedPets.length === 0) {
    console.log("  none");
  } else {
    for (const pet of result.installedPets) {
      const status = pet.invalid ? `invalid (${pet.issues.join("; ")})` : "ok";
      console.log(`  ${pet.id}: ${status}`);
      console.log(`    ${pet.dir}`);
    }
  }
  console.log("");

  console.log("Active marker:");
  const marker = result.activeMarker;
  if (!marker.exists) {
    console.log(`  missing at ${marker.path}`);
  } else if (!marker.readable) {
    console.log(`  unreadable at ${marker.path}: ${marker.error}`);
  } else if (!marker.validJson) {
    console.log(`  invalid JSON at ${marker.path}: ${marker.error}`);
  } else {
    console.log(`  path: ${marker.path}`);
    console.log(`  id: ${marker.contents?.id || "-"}`);
    console.log(`  packageDir: ${marker.contents?.packageDir || "-"}`);
    if (marker.issues.length > 0) {
      console.log(`  issues: ${marker.issues.join("; ")}`);
    } else {
      console.log("  status: ok");
    }
  }
  console.log("");

  console.log("Codex global state:");
  const state = result.codexState;
  console.log(`  path: ${state.statePath}`);
  if (!state.exists) {
    console.log("  status: missing");
  } else if (!state.readable) {
    console.log(`  status: unreadable (${state.error})`);
  } else if (!state.validJson) {
    console.log(`  status: invalid JSON (${state.error})`);
  } else {
    console.log(`  status: ${state.writable ? "readable and writable" : "readable but not writable"}`);
    console.log(`  persisted state: ${state.hasPersistedState ? "found" : "missing"}`);
    if (state.knownKeys.length > 0) {
      console.log("  known pet-selection keys:");
      for (const item of state.knownKeys) {
        console.log(`    ${item.key}: ${JSON.stringify(item.value)}`);
      }
    } else {
      console.log("  known pet-selection keys: none");
    }
  }
  console.log("");

  if (result.errors.length > 0) {
    console.log("Errors:");
    for (const error of result.errors) {
      console.log(`  - ${error}`);
    }
    console.log("");
  }
  if (result.warnings.length > 0) {
    console.log("Warnings:");
    for (const warning of result.warnings) {
      console.log(`  - ${warning}`);
    }
    console.log("");
  }

  if (result.errors.length === 0 && result.warnings.length === 0) {
    console.log("No common activation problems found.");
  } else {
    console.log("Fallback guidance:");
    printManualActivationGuidance(marker.contents?.id || "<pet-id>");
  }
}

function printEnableCommand(petId) {
  printManualActivationGuidance(petId);
  console.log(`${petId}: optional best-effort automation: npx awesome-codex-pets apply ${petId}`);
}

function printManualActivationGuidance(petId) {
  console.log(`${petId}: open Codex Desktop -> File -> Settings -> Appearance -> Pet and choose "${petId}".`);
  console.log(`${petId}: after selecting it, wake Codex Desktop; restart Codex Desktop only if the pet still does not appear.`);
}

function describeStateUpdateReason(reason) {
  switch (reason) {
    case "state-file-not-found":
      return "global state file not found";
    case "state-file-not-readable":
      return "global state file not readable";
    case "state-file-invalid-json":
      return "global state file has invalid JSON";
    case "persisted-state-not-found":
      return "persisted state block not found";
    case "state-file-not-writable":
      return "global state file not writable";
    case "no-known-state-key":
      return "no known writable pet-selection key found";
    default:
      return reason || "unknown reason";
  }
}

function printRows(rows, headers = ["ID", "Name", "Status", "Path"]) {
  const allRows = [headers, ...rows];
  const widths = headers.map((_, column) =>
    Math.max(...allRows.map((row) => String(row[column] || "").length))
  );
  for (const [index, row] of allRows.entries()) {
    const line = row
      .map((cell, column) => String(cell || "").padEnd(widths[column]))
      .join("  ");
    console.log(line);
    if (index === 0) {
      console.log(widths.map((width) => "-".repeat(width)).join("  "));
    }
  }
}

function printHelp() {
  console.log(`awesome-codex-pets

Usage:
  awesome-codex-pets list [--category <id>] [--json]
  awesome-codex-pets list --installed [--codex-home <path>]
  awesome-codex-pets show <pet-id> [--json]
  awesome-codex-pets install <pet-id|all> [--force] [--apply] [--codex-home <path>]
  awesome-codex-pets apply <pet-id> [--force] [--codex-home <path>]
  awesome-codex-pets doctor [--codex-home <path>] [--json]
  awesome-codex-pets where [--codex-home <path>] [--json]
  awesome-codex-pets validate

Aliases:
  npx awesome-codex-pets <command>
  npx codex-pets <command>
`);
}
