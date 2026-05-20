import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { ATLAS_HEIGHT, ATLAS_WIDTH } from "./animation.js";
import { categoryMap, discoverPetPackages, readCatalog, validateCatalog } from "./catalog.js";
import { generatePreviewGifs } from "./preview-gifs.js";
import { updateAllReadmeGalleries } from "./readme-gallery.js";
import { assertInside, packageRoot, petsDir, resolveCodexHome, toPosixPath } from "./paths.js";
import { syncCatalog } from "../scripts/sync-catalog.js";

const DRAFTS_DIR = path.join(".codex-pets", "drafts");
const PET_ID_PATTERN = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
const CATEGORY_ALIASES = new Map([
  ["anime", "anime-characters"],
  ["anime-characters", "anime-characters"],
  ["anime characters", "anime-characters"],
  ["animal", "animals"],
  ["animals", "animals"],
  ["original", "original-characters"],
  ["original-character", "original-characters"],
  ["original characters", "original-characters"],
  ["mascot", "mascots"],
  ["mascots", "mascots"],
  ["pixel", "pixel"],
  ["pixel-pets", "pixel"],
  ["pixel pets", "pixel"]
]);

export async function runAddPetCommand(parsed, { root = packageRoot() } = {}) {
  const [subcommand = "help", ...args] = parsed.positionals;
  const nextParsed = { flags: parsed.flags, positionals: args };

  switch (subcommand) {
    case "help":
    case "-h":
    case "--help":
      return { type: "help" };
    case "init":
      return initDraft(nextParsed, { root });
    case "import":
      return importPet(nextParsed, { root });
    case "finalize":
      return finalizePet(nextParsed, { root });
    default:
      throw new Error(`Unknown add-pet command: ${subcommand}. Run "npx awesome-codex-pets add-pet help".`);
  }
}

async function initDraft({ flags, positionals }, { root }) {
  const name = cleanString(positionals.join(" ")) || cleanString(flags.name);
  if (!name) {
    throw new Error("Usage: awesome-codex-pets add-pet init <pet-name> [--author <name-or-profile>]");
  }

  const catalog = await readCatalog(root);
  const petSlug = slugify(flags.petSlug || flags.pet || name);
  const profile = await resolveAuthorProfile({ root, flags });
  const authorSlug = slugify(flags.authorSlug || profile.author_slug || profile.author || profile.author_handle || "unknown");
  const slug = flags.slug || flags.petId || flags.id
    ? slugifyPetId(flags.slug || flags.petId || flags.id)
    : `${petSlug}--${authorSlug}`;
  validatePetId(slug, "draft slug");

  const existingPetDir = path.join(root, "pets", slug);
  if (await exists(existingPetDir) && !flags.force) {
    throw new Error(`Pet already exists at ${relativePath(root, existingPetDir)}. Use a different slug or --force.`);
  }

  const draftDir = draftPath(root, slug);
  const draftFile = path.join(draftDir, "submission.json");
  if (await exists(draftFile) && !flags.force) {
    throw new Error(`Draft already exists at ${relativePath(root, draftFile)}. Use --force to replace it.`);
  }

  const category = resolveCategoryName(catalog, flags.category || flags.primaryCategory || "");
  const submission = normalizeSubmission({
    slug,
    pet_slug: petSlug,
    author_slug: authorSlug,
    name: titleFromLabel(name),
    author: profile.author || "",
    author_handle: profile.author_handle || "",
    author_url: profile.author_url || "",
    primary_category: category,
    tags: splitList(flags.tags),
    source_type: cleanString(flags.sourceType),
    source_url: cleanString(flags.sourceUrl),
    license: cleanString(flags.license),
    description: cleanString(flags.description)
  });

  await fs.mkdir(draftDir, { recursive: true });
  await writeJson(draftFile, submission);

  return {
    type: "init",
    draftDir,
    draftFile,
    slug,
    submission,
    warnings: metadataWarnings(submission, { draft: true })
  };
}

async function importPet({ flags, positionals }, { root }) {
  const sourceArg = positionals[0];
  const draftId = cleanString(flags.draft);
  const draftSubmission = draftId ? await readDraftSubmission(root, draftId) : null;
  const explicitTargetId = cleanString(flags.petId || flags.id);
  const profile = await resolveAuthorProfile({ root, flags });
  const sourceId = sourceArg && !looksLikePath(sourceArg) ? slugifyPetId(sourceArg) : "";
  const initialTargetId = explicitTargetId || draftId || sourceId;
  if (!initialTargetId && !sourceArg) {
    throw new Error("Usage: awesome-codex-pets add-pet import [path|pet-id] [--draft <pet-id>|--pet-id <pet-id>] [--force] [--codex-home <path>]");
  }

  const sourceDir = await resolveImportSourceDir({
    root,
    sourceArg,
    targetId: initialTargetId,
    draftSubmission,
    codexHome: flags.codexHome
  });
  const source = await resolveSourcePackage(sourceDir);
  const sourceManifest = source.virtualManifest || await readJson(source.manifestPath);
  const targetId = resolveImportTargetId({
    explicitTargetId,
    draftId,
    sourceId,
    sourceManifest,
    profile,
    flags
  });
  if (!targetId) {
    throw new Error("Cannot resolve pet id. Pass --draft <pet-id> or --pet-id <pet-id>.");
  }
  validatePetId(targetId, "pet id");

  const targetRoot = path.join(root, "pets");
  const targetDir = path.join(targetRoot, targetId);
  assertInside(targetRoot, targetDir);
  if (await exists(targetDir) && !flags.force) {
    throw new Error(`Pet package already exists at ${relativePath(root, targetDir)}. Use --force to replace it.`);
  }

  await validateSourcePackage({ source, manifest: sourceManifest });

  const submission = await submissionForImport({
    root,
    targetId,
    draftSubmission,
    profile,
    sourceDir,
    sourceManifest
  });
  const manifest = normalizePetManifest(sourceManifest, targetId, submission);

  await fs.rm(targetDir, { recursive: true, force: true });
  await fs.mkdir(targetDir, { recursive: true });
  await writeJson(path.join(targetDir, "submission.json"), submission);
  await writeJson(path.join(targetDir, "pet.json"), manifest);
  await fs.copyFile(source.spritesheetPath, path.join(targetDir, "spritesheet.webp"));

  return {
    type: "import",
    petId: targetId,
    targetDir,
    files: [
      path.join(targetDir, "submission.json"),
      path.join(targetDir, "pet.json"),
      path.join(targetDir, "spritesheet.webp")
    ],
    manifestRewritten: sourceManifest.id && sourceManifest.id !== targetId,
    warnings: metadataWarnings(submission, { draft: false })
  };
}

async function finalizePet({ flags, positionals }, { root }) {
  const petId = cleanString(positionals[0] || flags.petId || flags.id);
  if (!petId) {
    throw new Error("Usage: awesome-codex-pets add-pet finalize <pet-id> [--force]");
  }
  validatePetId(petId, "pet id");

  const packageDir = path.join(root, "pets", petId);
  const manifest = await readJson(path.join(packageDir, "pet.json"));
  await fs.access(path.join(packageDir, "spritesheet.webp"));

  const submission = await readOptionalJson(path.join(packageDir, "submission.json"));
  const metadata = submission
    ? metadataWarnings({
      ...submission,
      description: cleanString(submission.description) || cleanString(manifest.description)
    }, { draft: false })
    : ["missing submission.json"];

  const sync = await syncCatalog({ root });
  const previews = await generatePreviewGifs({
    root,
    petIds: [petId],
    force: flags.force !== false
  });
  const readmes = await updateAllReadmeGalleries({ root });
  const validation = await validateCatalog(root);

  if (validation.errors.length > 0) {
    const message = validation.errors.map((error) => `error: ${error}`).join("\n");
    throw new Error(`Finalize generated invalid catalog output:\n${message}`);
  }

  return {
    type: "finalize",
    petId,
    sync,
    previewCount: previews.length,
    readme: {
      readmePath: readmes.map((item) => item.readmePath).join(", "),
      results: readmes
    },
    validation: {
      errors: validation.errors,
      warnings: validation.warnings
    },
    metadataWarnings: metadata,
    reviewFiles: [
      path.join(packageDir, "submission.json"),
      path.join(packageDir, "pet.json"),
      path.join(packageDir, "spritesheet.webp"),
      path.join(root, "catalog", "pets.json"),
      path.join(root, "assets", "previews", petId),
      path.join(root, "README.md"),
      path.join(root, "README_zh.md")
    ]
  };
}

async function resolveAuthorProfile({ root, flags }) {
  const requested = cleanString(flags.author || flags.authorSlug || flags.authorHandle);
  const profiles = await loadAuthorProfiles(root);
  const profile = requested ? profiles.get(slugify(requested)) || {} : {};

  const authorHandle = cleanString(flags.authorHandle) || profile.author_handle || "";
  const authorUrl = cleanString(flags.authorUrl)
    || profile.author_url
    || (authorHandle ? `https://github.com/${authorHandle}` : "");

  return {
    author_slug: cleanString(flags.authorSlug) || profile.author_slug || "",
    author: cleanString(flags.author) && !profiles.has(slugify(flags.author))
      ? cleanString(flags.author)
      : profile.author || cleanString(flags.author) || "",
    author_handle: authorHandle,
    author_url: authorUrl
  };
}

async function loadAuthorProfiles(root) {
  const profiles = new Map();
  for (const petPackage of await discoverPetPackages(root)) {
    const submission = await readOptionalJson(path.join(petPackage.packageDir, "submission.json"));
    if (!submission) {
      continue;
    }
    const profile = {
      author_slug: cleanString(submission.author_slug),
      author: cleanString(submission.author),
      author_handle: cleanString(submission.author_handle),
      author_url: cleanString(submission.author_url)
    };
    for (const key of [profile.author_slug, profile.author_handle, profile.author]) {
      if (key) {
        profiles.set(slugify(key), profile);
      }
    }
  }
  return profiles;
}

async function submissionForImport({ targetId, draftSubmission, profile, sourceDir, sourceManifest }) {
  const sourceSubmission = await readOptionalJson(path.join(sourceDir, "submission.json"));
  const idParts = splitPetId(targetId);
  const base = draftSubmission || sourceSubmission || {};
  const authorHandle = cleanString(base.author_handle) || cleanString(profile.author_handle);
  const authorUrl = cleanString(base.author_url)
    || cleanString(profile.author_url)
    || (authorHandle ? `https://github.com/${authorHandle}` : "");

  return normalizeSubmission({
    ...base,
    slug: targetId,
    pet_slug: cleanString(base.pet_slug) || idParts.petSlug,
    author_slug: cleanString(base.author_slug) || idParts.authorSlug || cleanString(profile.author_slug),
    name: cleanString(base.name) || cleanString(sourceManifest.displayName) || titleFromLabel(idParts.petSlug),
    author: cleanString(base.author) || cleanString(profile.author),
    author_handle: authorHandle,
    author_url: authorUrl,
    description: cleanString(base.description) || cleanString(sourceManifest.description)
  });
}

function resolveImportTargetId({ explicitTargetId, draftId, sourceId, sourceManifest, profile, flags }) {
  if (explicitTargetId) {
    return slugifyPetId(explicitTargetId);
  }
  if (draftId) {
    return slugifyPetId(draftId);
  }
  if (sourceId && sourceId.includes("--")) {
    return sourceId;
  }

  const manifestId = cleanString(sourceManifest.id) ? slugifyPetId(sourceManifest.id) : "";
  if (manifestId && manifestId.includes("--")) {
    return manifestId;
  }

  const petSlug = slugify(flags.petSlug || flags.pet || sourceId || manifestId || sourceManifest.displayName);
  const authorSlug = slugify(flags.authorSlug || profile.author_slug || profile.author || profile.author_handle || "");
  if (petSlug && authorSlug && authorSlug !== "unknown") {
    return `${petSlug}--${authorSlug}`;
  }

  return sourceId || manifestId;
}

async function readDraftSubmission(root, draftId) {
  const draftFile = path.join(draftPath(root, draftId), "submission.json");
  const submission = await readOptionalJson(draftFile);
  if (!submission) {
    throw new Error(`Draft not found: ${relativePath(root, draftFile)}`);
  }
  return submission;
}

async function resolveImportSourceDir({ root, sourceArg, targetId, draftSubmission, codexHome }) {
  if (sourceArg && looksLikePath(sourceArg)) {
    return resolveUserPath(sourceArg);
  }

  const sourceId = slugifyPetId(sourceArg || draftSubmission?.slug || targetId);
  const candidates = [];
  const home = resolveCodexHome(codexHome);
  for (const id of uniqueStrings([
    sourceId,
    targetId,
    draftSubmission?.slug,
    draftSubmission?.pet_slug
  ])) {
    candidates.push(path.join(petsDir(home), id));
  }

  for (const candidate of candidates) {
    if (await exists(candidate)) {
      return candidate;
    }
  }

  if (sourceArg) {
    const localCandidate = path.resolve(root, sourceArg);
    if (await exists(localCandidate)) {
      return localCandidate;
    }
  }

  throw new Error(
    `Import source not found. Looked in: ${candidates.map((item) => item).join(", ")}. ` +
    "Pass an explicit path if the pet was generated elsewhere."
  );
}

async function resolveSourcePackage(sourceDir) {
  const manifestPath = path.join(sourceDir, "pet.json");
  const manifest = await readOptionalJson(manifestPath);
  if (manifest) {
    const spriteName = cleanString(manifest.spritesheetPath) || "spritesheet.webp";
    const spritesheetPath = path.resolve(sourceDir, spriteName);
    assertInside(sourceDir, spritesheetPath);
    return {
      manifestPath,
      spritesheetPath
    };
  }

  const requestPath = path.join(sourceDir, "pet_request.json");
  const request = await readOptionalJson(requestPath);
  const finalSpritesheet = path.join(sourceDir, "final", "spritesheet.webp");
  if (request && await exists(finalSpritesheet)) {
    const generatedManifest = {
      id: cleanString(request.pet_id),
      displayName: cleanString(request.display_name),
      description: cleanString(request.description),
      spritesheetPath: "final/spritesheet.webp"
    };
    return {
      virtualManifest: generatedManifest,
      spritesheetPath: finalSpritesheet
    };
  }

  throw new Error(`Import source must contain pet.json and spritesheet.webp, or a hatch-pet run with pet_request.json and final/spritesheet.webp: ${sourceDir}`);
}

async function validateSourcePackage({ source, manifest }) {
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    throw new Error("pet.json must contain a JSON object.");
  }
  if (!cleanString(manifest.displayName)) {
    throw new Error("pet.json is missing displayName.");
  }
  if (!cleanString(manifest.spritesheetPath)) {
    throw new Error("pet.json is missing spritesheetPath.");
  }
  await fs.access(source.spritesheetPath);
  await validateAtlasDimensions(source.spritesheetPath);
}

async function validateAtlasDimensions(spritesheetPath) {
  const sharp = await loadSharp();
  const metadata = await sharp(spritesheetPath).metadata();
  if (metadata.width !== ATLAS_WIDTH || metadata.height !== ATLAS_HEIGHT) {
    throw new Error(
      `spritesheet.webp must be ${ATLAS_WIDTH}x${ATLAS_HEIGHT}, got ${metadata.width}x${metadata.height}: ${spritesheetPath}`
    );
  }
}

async function loadSharp() {
  try {
    const module = await import("sharp");
    return module.default;
  } catch (error) {
    throw new Error(`add-pet import requires the optional "sharp" package. Run "npm install" first. Original error: ${error.message}`);
  }
}

function normalizePetManifest(manifest, targetId, submission) {
  return {
    id: targetId,
    displayName: cleanString(manifest.displayName) || cleanString(submission.name) || titleFromLabel(targetId),
    description: cleanString(manifest.description) || cleanString(submission.description),
    spritesheetPath: "spritesheet.webp"
  };
}

function normalizeSubmission(value) {
  const slug = cleanString(value.slug);
  const normalized = {
    slug,
    pet_slug: cleanString(value.pet_slug) || splitPetId(slug).petSlug,
    author_slug: cleanString(value.author_slug) || splitPetId(slug).authorSlug,
    name: cleanString(value.name),
    author: cleanString(value.author),
    author_handle: cleanString(value.author_handle),
    author_url: cleanString(value.author_url),
    primary_category: cleanString(value.primary_category),
    tags: splitList(value.tags),
    source_type: cleanString(value.source_type),
    source_url: cleanString(value.source_url),
    license: cleanString(value.license),
    description: cleanString(value.description),
    preview_image: cleanString(value.preview_image) || `../../assets/previews/${slug}/idle.gif`,
    codex_install: {
      pet_json: "pet.json",
      spritesheet: "spritesheet.webp"
    },
    preview_assets: {
      contact_sheet: cleanString(value.preview_assets?.contact_sheet) || `../../assets/previews/${slug}/contact-sheet.png`,
      gifs_dir: cleanString(value.preview_assets?.gifs_dir) || `../../assets/previews/${slug}`
    }
  };

  if (!normalized.author_url && normalized.author_handle) {
    normalized.author_url = `https://github.com/${normalized.author_handle}`;
  }
  return normalized;
}

function metadataWarnings(submission, { draft }) {
  const warnings = [];
  const required = draft
    ? []
    : ["author", "author_url", "primary_category", "source_type", "license", "description"];
  for (const key of required) {
    if (!cleanString(submission?.[key])) {
      warnings.push(`${key} is empty`);
    }
  }
  if (cleanString(submission?.author_url) && !/^https?:\/\//.test(submission.author_url)) {
    warnings.push("author_url should be an absolute URL");
  }
  return warnings;
}

function resolveCategoryName(catalog, value) {
  const raw = cleanString(value);
  if (!raw) {
    return "";
  }
  const categories = categoryMap(catalog);
  if (categories.has(raw)) {
    return categories.get(raw).name;
  }
  const normalized = slugify(raw);
  const aliased = CATEGORY_ALIASES.get(normalized) || CATEGORY_ALIASES.get(raw.toLowerCase());
  if (aliased && categories.has(aliased)) {
    return categories.get(aliased).name;
  }
  if (categories.has(normalized)) {
    return categories.get(normalized).name;
  }
  for (const category of categories.values()) {
    if (slugify(category.name) === normalized) {
      return category.name;
    }
  }
  return titleFromLabel(raw);
}

function splitPetId(value) {
  const [petSlug = "", authorSlug = ""] = cleanString(value).split("--");
  return { petSlug, authorSlug };
}

function splitList(value) {
  if (Array.isArray(value)) {
    return value.flatMap(splitList);
  }
  return String(value || "")
    .split(",")
    .map(cleanString)
    .filter(Boolean);
}

function uniqueStrings(values) {
  return [...new Set(values.map(cleanString).filter(Boolean))];
}

function looksLikePath(value) {
  const raw = cleanString(value);
  return raw === "."
    || raw === ".."
    || raw.startsWith(".")
    || raw.startsWith("~")
    || raw.includes("/")
    || raw.includes("\\")
    || path.isAbsolute(raw);
}

function resolveUserPath(value) {
  const raw = cleanString(value);
  if (raw === "~") {
    return os.homedir();
  }
  if (raw.startsWith("~/") || raw.startsWith("~\\")) {
    return path.join(os.homedir(), raw.slice(2));
  }
  return path.resolve(raw);
}

function validatePetId(value, label) {
  if (!PET_ID_PATTERN.test(value)) {
    throw new Error(`Invalid ${label}: ${value}. Use lowercase letters, numbers, and hyphens.`);
  }
}

function slugify(value) {
  const slug = cleanString(value)
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-|-$/g, "");
  return slug || "unknown";
}

function slugifyPetId(value) {
  const raw = cleanString(value);
  if (raw.includes("--")) {
    return raw
      .split("--")
      .map(slugify)
      .filter(Boolean)
      .join("--");
  }
  return slugify(raw);
}

function titleFromLabel(value) {
  return cleanString(value)
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

async function writeJson(filePath, value) {
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
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

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function draftPath(root, slug) {
  const draftsRoot = path.join(root, DRAFTS_DIR);
  const target = path.join(draftsRoot, slug);
  assertInside(draftsRoot, target);
  return target;
}

function cleanString(value) {
  return String(value ?? "").trim();
}

function relativePath(root, filePath) {
  return toPosixPath(path.relative(root, filePath));
}
