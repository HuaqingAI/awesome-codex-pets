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
  readmePath = path.join(root, "README.md"),
  lang = "en"
} = {}) {
  const readme = await fs.readFile(readmePath, "utf8");
  const catalog = await readCatalog(root);
  const gallery = renderGallery(catalog, { lang });
  const next = replaceBetweenMarkers(readme, gallery);
  await fs.writeFile(readmePath, next, "utf8");
  return { readmePath, petCount: (catalog.pets || []).length };
}

export async function updateAllReadmeGalleries({ root = packageRoot() } = {}) {
  const results = [];
  results.push(await updateReadmeGallery({
    root,
    readmePath: path.join(root, "README.md"),
    lang: "en"
  }));
  results.push(await updateReadmeGallery({
    root,
    readmePath: path.join(root, "README_zh.md"),
    lang: "zh"
  }));
  return results;
}

export function renderGallery(catalog, { lang = "en" } = {}) {
  const pets = catalog.pets || [];
  if (pets.length === 0) {
    return lang === "zh" ? "_还没有添加宠物。_" : "_No pets have been added yet._";
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
    chunks.push(`### ${escapeMarkdown(categoryLabel(categories.get(categoryId)?.name || categoryId, lang))}`);
    for (const pet of groupPets) {
      chunks.push(renderPetTable(catalog, pet, { lang }));
    }
  }
  return chunks.join("\n\n");
}

function renderPetTable(catalog, pet, { lang = "en" } = {}) {
  const states = normalizeStateList(
    pet.previewStates || catalog.previewStates,
    README_PREVIEW_STATES
  ).map((id) => getState(id));
  const colSpan = states.length;
  const rawBaseUrl = catalog.rawBaseUrl || "https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main";
  const packageName = catalog.packageName || "awesome-codex-pets";
  const author = renderAuthor(pet);
  const category = categoryLabel(categoryName(catalog, pet.category), lang);
  const petName = pet.url
    ? `<a href="${escapeHtml(pet.url)}">${escapeHtml(pet.name)}</a>`
    : escapeHtml(pet.name);
  const installCommand = `npx ${packageName} install ${pet.id}`;
  const curlCommand = `curl -fsSL ${rawBaseUrl}/scripts/install-pet.sh | bash -s -- ${pet.id}`;

  const actionHeaders = states.map((state) => `<th>${escapeHtml(stateLabel(state, lang))}</th>`).join("");
  const previewCells = states
    .map((state) => {
      const src = previewPathForPet(pet, state.id);
      const alt = `${pet.name} ${stateLabel(state, lang)}`;
      return `<td><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" width="96" /></td>`;
    })
    .join("");

  return `<table>
  <tr>
    <th>${label("name", lang)}</th>
    <td colspan="${colSpan}">${petName}${author ? ` - ${label("by", lang)} ${author}` : ""} - ${escapeHtml(category)}</td>
  </tr>
  <tr>
    <th>${label("install", lang)}</th>
    <td colspan="${colSpan}"><code>${escapeHtml(installCommand)}</code><br/><code>${escapeHtml(curlCommand)}</code></td>
  </tr>
  <tr>
    <th>${label("action", lang)}</th>
    ${actionHeaders}
  </tr>
  <tr>
    <th>${label("preview", lang)}</th>
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

function label(key, lang) {
  const labels = {
    name: ["Name", "名称"],
    install: ["Install", "安装"],
    action: ["Action", "动作"],
    preview: ["Preview", "预览"],
    by: ["by", "作者"]
  };
  const value = labels[key] || [key, key];
  return lang === "zh" ? value[1] : value[0];
}

function categoryLabel(value, lang) {
  if (lang !== "zh") {
    return value;
  }
  const labels = new Map([
    ["Mascots", "吉祥物"],
    ["Anime Characters", "动漫角色"],
    ["Animals", "动物"],
    ["Original Characters", "原创角色"],
    ["Pixel Pets", "像素宠物"]
  ]);
  return labels.get(value) || value;
}

function stateLabel(state, lang) {
  if (lang !== "zh") {
    return state.label;
  }
  const labels = new Map([
    ["idle", "待机"],
    ["waving", "挥手"],
    ["running", "工作"],
    ["waiting", "等待"],
    ["review", "审阅"],
    ["running-right", "向右移动"],
    ["running-left", "向左移动"],
    ["jumping", "跳跃"],
    ["failed", "失败"]
  ]);
  return labels.get(state.id) || state.label;
}
