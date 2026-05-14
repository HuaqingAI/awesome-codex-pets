import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function packageRoot() {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
}

export function defaultCodexHome() {
  return process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
}

export function resolveCodexHome(value) {
  return path.resolve(value || defaultCodexHome());
}

export function petsDir(codexHome) {
  return path.join(resolveCodexHome(codexHome), "pets");
}

export function activeMarkerPath(codexHome) {
  return path.join(petsDir(codexHome), ".active-pet.json");
}

export function toPosixPath(value) {
  return value.split(path.sep).join("/");
}

export function assertInside(parent, child) {
  const resolvedParent = path.resolve(parent);
  const resolvedChild = path.resolve(child);
  const relative = path.relative(resolvedParent, resolvedChild);
  if (relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative))) {
    return;
  }
  throw new Error(`Refusing to write outside ${resolvedParent}: ${resolvedChild}`);
}
