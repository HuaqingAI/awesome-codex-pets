import fs from "node:fs/promises";
import path from "node:path";
import {
  README_PREVIEW_STATES,
  getState,
  normalizeStateList
} from "./animation.js";
import {
  categoryMap,
  categoryName,
  displayAuthor,
  previewPathForPet,
  readCatalog
} from "./catalog.js";
import { packageRoot } from "./paths.js";

export const START_MARKER = "<!-- PET_CATALOG_START -->";
export const END_MARKER = "<!-- PET_CATALOG_END -->";

export async function updateReadmeGallery({
  root = packageRoot(),
  readmePath = path.join(root, "README.md")
} = {}) {
  const readme = await fs.readFile(readmePath, "utf8");
  const catalog = await readCatalog(root);
  const gallery = renderGallery(catalog);
  const next = replaceBetweenMarkers(readme, gallery);
  await fs.writeFile(readmePath, next, "utf8");
  return { readmePath, petCount: (catalog.pets || []).length };
}

export function renderGallery(catalog) {
  const pets = catalog.pets || [];
  if (pets.length === 0) {
    return "_No pets have been added yet._";
  }

  const categories = categoryMap(catalog);
  const grouped = new Map();
  for (const category of catalog.categories || []) {
    grouped.set(category.id, []);
  }
  for (const pet of pets) {
    if (!grouped.has(pet.category)) {
      grouped.set(pet.category, []);
    }
    grouped.get(pet.category).push(pet);
  }

  const chunks = [];
  for (const [categoryId, groupPets] of grouped.entries()) {
    if (groupPets.length === 0) {
      continue;
    }
    chunks.push(`### ${escapeMarkdown(categories.get(categoryId)?.name || categoryId)}`);
    for (const pet of groupPets) {
      chunks.push(renderPetTable(catalog, pet));
    }
  }
  return chunks.join("\n\n");
}

function renderPetTable(catalog, pet) {
  const states = normalizeStateList(
    pet.previewStates || catalog.previewStates,
    README_PREVIEW_STATES
  ).map((id) => getState(id));
  const colSpan = states.length;
  const rawBaseUrl = catalog.rawBaseUrl || "https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main";
  const packageName = catalog.packageName || "awesome-codex-pets";
  const author = renderAuthor(pet);
  const category = categoryName(catalog, pet.category);
  const petName = pet.url
    ? `<a href="${escapeHtml(pet.url)}">${escapeHtml(pet.name)}</a>`
    : escapeHtml(pet.name);
  const installCommand = `npx ${packageName} install ${pet.id}`;
  const curlCommand = `curl -fsSL ${rawBaseUrl}/scripts/install-pet.sh | bash -s -- ${pet.id}`;

  const actionHeaders = states.map((state) => `<th>${escapeHtml(state.label)}</th>`).join("");
  const previewCells = states
    .map((state) => {
      const src = previewPathForPet(pet, state.id);
      const alt = `${pet.name} ${state.label}`;
      return `<td><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" width="96" /></td>`;
    })
    .join("");

  return `<table>
  <tr>
    <th>Name</th>
    <td colspan="${colSpan}">${petName}${author ? ` · by ${author}` : ""} · ${escapeHtml(category)}</td>
  </tr>
  <tr>
    <th>Install</th>
    <td colspan="${colSpan}"><code>${escapeHtml(installCommand)}</code><br/><code>${escapeHtml(curlCommand)}</code></td>
  </tr>
  <tr>
    <th>Action</th>
    ${actionHeaders}
  </tr>
  <tr>
    <th>Preview</th>
    ${previewCells}
  </tr>
</table>`;
}

function renderAuthor(pet) {
  if (!pet.author) {
    return "";
  }
  if (typeof pet.author === "string") {
    return escapeHtml(pet.author);
  }
  if (pet.author.url) {
    return `<a href="${escapeHtml(pet.author.url)}">@${escapeHtml(pet.author.name)}</a>`;
  }
  return escapeHtml(displayAuthor(pet));
}

function replaceBetweenMarkers(input, replacement) {
  const start = input.indexOf(START_MARKER);
  const end = input.indexOf(END_MARKER);
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`README must contain ${START_MARKER} and ${END_MARKER}.`);
  }
  return `${input.slice(0, start + START_MARKER.length)}\n${replacement}\n${input.slice(end)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeMarkdown(value) {
  return String(value).replaceAll("[", "\\[").replaceAll("]", "\\]");
}
