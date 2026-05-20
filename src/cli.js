import path from "node:path";
import { readFile } from "node:fs/promises";
import { runAddPetCommand } from "./add-pet.js";
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
const LANGUAGE_FLAG_KEYS = new Set(["json", "force", "apply", "installed", "help"]);

export async function runCli(argv) {
  const { command = "help", rest } = splitCommand(argv);
  const parsed = parseArgs(rest);
  const lang = resolveLanguage(parsed.flags);

  if (parsed.flags.help || command === "help" || command === "-h" || command === "--help") {
    printHelp(lang);
    return;
  }

  if (command === "version" || command === "--version" || command === "-v") {
    const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
    console.log(packageJson.version);
    return;
  }

  switch (command) {
    case "list":
      await listCommand(parsed, lang);
      return;
    case "show":
      await showCommand(parsed, lang);
      return;
    case "install":
      await installCommand(parsed, lang);
      return;
    case "apply":
      await applyCommand(parsed, lang);
      return;
    case "add-pet":
      await addPetCommand(parsed, lang);
      return;
    case "doctor":
      await doctorCommand(parsed, lang);
      return;
    case "where":
      await whereCommand(parsed, lang);
      return;
    case "validate":
      await validateCommand(parsed, lang);
      return;
    default:
      throw new Error(`Unknown command: ${command}. Run "npx awesome-codex-pets help".`);
  }
}

function splitCommand(argv) {
  const leadingFlags = [];
  let index = 0;
  while (index < argv.length) {
    const arg = argv[index];
    if (arg === "--lang" || arg === "--language") {
      leadingFlags.push(arg);
      if (argv[index + 1] && !argv[index + 1].startsWith("--")) {
        leadingFlags.push(argv[index + 1]);
        index += 2;
      } else {
        index += 1;
      }
      continue;
    }
    if (arg.startsWith("--lang=") || arg.startsWith("--language=")) {
      leadingFlags.push(arg);
      index += 1;
      continue;
    }
    break;
  }

  const command = argv[index] || "help";
  return {
    command,
    rest: [...leadingFlags, ...argv.slice(index + 1)]
  };
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
    if (next && !next.startsWith("--") && !LANGUAGE_FLAG_KEYS.has(key)) {
      flags[key] = next;
      index += 1;
    } else {
      flags[key] = true;
    }
  }

  return { flags, positionals };
}

function resolveLanguage(flags = {}) {
  const explicit = String(flags.lang || flags.language || process.env.AWESOME_CODEX_PETS_LANG || "").toLowerCase();
  if (["zh", "zh-cn", "cn", "chinese"].includes(explicit)) {
    return "zh";
  }
  if (["en", "en-us", "english"].includes(explicit)) {
    return "en";
  }

  const locale = [
    process.env.LANGUAGE,
    process.env.LC_ALL,
    process.env.LC_MESSAGES,
    process.env.LANG,
    process.env.USERLANGUAGE,
    Intl.DateTimeFormat().resolvedOptions().locale
  ].filter(Boolean).join(" ").toLowerCase();
  return locale.includes("zh") ? "zh" : "en";
}

function text(lang, en, zh) {
  return lang === "zh" ? zh : en;
}

function section(title) {
  console.log("");
  console.log(`== ${title} ==`);
}

function item(label, value) {
  console.log(`  ${label}: ${value}`);
}

function bullet(value) {
  console.log(`  - ${value}`);
}

async function addPetCommand(parsed, lang) {
  const result = await runAddPetCommand(parsed, { root });
  if (result.type === "help") {
    printAddPetHelp(lang);
    return;
  }
  if (parsed.flags.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  switch (result.type) {
    case "init":
      section(text(lang, "Draft created", "草稿已创建"));
      item(text(lang, "Pet id", "宠物 ID"), result.slug);
      item(text(lang, "Draft file", "草稿文件"), result.draftFile);
      printWarnings(result.warnings, lang);
      section(text(lang, "Next step", "下一步"));
      bullet(text(
        lang,
        "Generate the pet with Hatch Pet, then import it from the Codex pets directory:",
        "使用 Hatch Pet 生成宠物后，从 Codex pets 目录导入："
      ));
      console.log(`    npx awesome-codex-pets add-pet import --draft ${result.slug}`);
      return;
    case "import":
      section(text(lang, "Pet imported", "宠物已导入"));
      item(text(lang, "Pet id", "宠物 ID"), result.petId);
      item(text(lang, "Package directory", "包目录"), result.targetDir);
      if (result.manifestRewritten) {
        bullet(text(lang, "pet.json id was rewritten to match the package directory.", "已重写 pet.json 的 id，使其和包目录一致。"));
      }
      printWarnings(result.warnings, lang);
      section(text(lang, "Next step", "下一步"));
      console.log(`    npx awesome-codex-pets add-pet finalize ${result.petId}`);
      return;
    case "finalize":
      section(text(lang, "Pet finalized", "宠物已完成整理"));
      item(text(lang, "Pet id", "宠物 ID"), result.petId);
      item(text(lang, "Catalog pets", "目录宠物数"), result.sync.petCount);
      item(text(lang, "Preview GIFs", "预览 GIF 数"), result.previewCount);
      item(text(lang, "README", "README"), result.readme.readmePath);
      printWarnings(result.metadataWarnings, lang);
      for (const warning of result.validation.warnings) {
        printWarning(warning, lang);
      }
      console.log(text(lang, "Validation passed.", "校验通过。"));
      section(text(lang, "Review before PR", "提交 PR 前请检查"));
      for (const filePath of result.reviewFiles) {
        bullet(filePath);
      }
      return;
    default:
      throw new Error(`Unknown add-pet result: ${result.type}`);
  }
}

async function listCommand({ flags }, lang) {
  const codexHome = resolveCodexHome(flags.codexHome);
  if (flags.installed) {
    const pets = await listInstalledPets(codexHome);
    if (flags.json) {
      console.log(JSON.stringify({ codexHome, pets }, null, 2));
      return;
    }
    section(text(lang, "Installed Codex pets", "已安装的 Codex 宠物"));
    item(text(lang, "Directory", "目录"), petsDir(codexHome));
    if (pets.length === 0) {
      console.log(text(lang, "No installed pets found.", "没有找到已安装的宠物。"));
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
    console.log(text(lang, "No pets in catalog yet.", "目录里还没有宠物。"));
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

async function showCommand({ flags, positionals }, lang) {
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
  section(`${pet.name} (${pet.id})`);
  item(text(lang, "Category", "分类"), categoryName(catalog, pet.category));
  item(text(lang, "Author", "作者"), displayAuthor(pet) || "-");
  if (pet.description) {
    item(text(lang, "Description", "描述"), pet.description);
  }
}

async function installCommand({ flags, positionals }, lang) {
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
  if (!flags.json) {
    section(text(lang, "Install Codex pet", "安装 Codex 宠物"));
    item(text(lang, "Codex home", "Codex 主目录"), codexHome);
  }
  for (const id of ids) {
    const result = await installPet({ root, catalog, petId: id, codexHome, force });
    results.push(result);
    if (!flags.json) {
      printInstallResult(result, { showNextStep: !flags.apply, lang });
    }
  }

  if (flags.apply) {
    if (ids.length !== 1) {
      throw new Error("--apply can only be used when installing one pet.");
    }
    const result = await applyPet({ root, catalog, petId: ids[0], codexHome, force });
    if (!flags.json) {
      printApplyResult(result, lang);
    } else {
      results.push({ apply: result });
    }
  }

  if (flags.json) {
    console.log(JSON.stringify(results, null, 2));
  }
}

async function applyCommand({ flags, positionals }, lang) {
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
  section(text(lang, "Apply Codex pet", "应用 Codex 宠物"));
  printInstallResult(result, { showNextStep: false, lang });
  printApplyResult(result, lang);
}

async function doctorCommand({ flags }, lang) {
  const codexHome = resolveCodexHome(flags.codexHome);
  const result = await diagnoseCodexPets(codexHome);

  if (flags.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  printDoctorResult(result, lang);
  if (result.errors.length > 0) {
    process.exitCode = 1;
  }
}

async function whereCommand({ flags }, lang) {
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
  section(text(lang, "Paths", "路径"));
  for (const [key, value] of Object.entries(payload)) {
    item(key, value);
  }
}

async function validateCommand({ flags }, lang) {
  const result = await validateCatalog(root);
  if (flags.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  for (const warning of result.warnings) {
    printWarning(warning, lang);
  }
  if (result.errors.length > 0) {
    for (const error of result.errors) {
      console.error(`${text(lang, "error", "错误")}: ${error}`);
    }
    throw new Error(`Catalog validation failed with ${result.errors.length} error(s).`);
  }
  console.log(text(lang, "Catalog validation passed.", "目录校验通过。"));
}

function printInstallResult(result, { showNextStep = false, lang = "en" } = {}) {
  section(result.pet.name || result.pet.id);
  if (result.skipped) {
    item(text(lang, "Status", "状态"), text(lang, "Already installed", "已安装"));
    item(text(lang, "Location", "位置"), result.targetDir);
    if (showNextStep) {
      printEnableCommand(result.pet.id, lang);
    }
    return;
  }
  if (result.installed) {
    item(text(lang, "Status", "状态"), result.repaired
      ? text(lang, "Repaired installation", "已修复安装")
      : text(lang, "Installed", "已安装"));
    item(text(lang, "Source", "来源"), result.source === "remote"
      ? text(lang, "Downloaded from GitHub", "已从 GitHub 下载")
      : text(lang, "Local package", "本地包"));
    item(text(lang, "Location", "位置"), result.targetDir);
    if (showNextStep) {
      printEnableCommand(result.pet.id, lang);
    }
  }
}

function printApplyResult(result, lang) {
  const petId = result.pet.id;
  section(text(lang, "Activation status", "启用状态"));
  item(text(lang, "Active marker", "启用标记"), result.marker);
  if (result.stateUpdate?.updatedKeys?.length) {
    item(text(lang, "Updated Codex state keys", "已更新 Codex 状态键"), result.stateUpdate.updatedKeys.join(", "));
  } else {
    const reason = describeStateUpdateReason(result.stateUpdate?.reason);
    item(text(lang, "Codex UI selection", "Codex UI 选择状态"), text(
      lang,
      `Not updated automatically (${reason})`,
      `未能自动更新（${reason}）`
    ));
  }
  bullet(text(lang, "Automatic activation is best-effort. Manual selection may still be required.", "自动启用是尽力而为；有些 Codex Desktop 版本仍需要手动选择。"));
  printManualActivationGuidance(petId, lang);
}

function printDoctorResult(result, lang) {
  section(text(lang, "Codex pets doctor", "Codex 宠物诊断"));
  item("CODEX_HOME", result.codexHome);
  item(text(lang, "Pets directory", "宠物目录"), result.petsDir);

  section(text(lang, "Installed pets", "已安装宠物"));
  if (result.installedPets.length === 0) {
    console.log(text(lang, "  none", "  无"));
  } else {
    for (const pet of result.installedPets) {
      const status = pet.invalid
        ? `${text(lang, "invalid", "无效")} (${pet.issues.join("; ")})`
        : text(lang, "ok", "正常");
      item(pet.id, status);
      console.log(`    ${pet.dir}`);
    }
  }

  section(text(lang, "Active marker", "启用标记"));
  const marker = result.activeMarker;
  if (!marker.exists) {
    item(text(lang, "Status", "状态"), text(lang, "missing", "缺失"));
    item(text(lang, "Path", "路径"), marker.path);
  } else if (!marker.readable) {
    item(text(lang, "Status", "状态"), `${text(lang, "unreadable", "无法读取")} (${marker.error})`);
    item(text(lang, "Path", "路径"), marker.path);
  } else if (!marker.validJson) {
    item(text(lang, "Status", "状态"), `${text(lang, "invalid JSON", "JSON 无效")} (${marker.error})`);
    item(text(lang, "Path", "路径"), marker.path);
  } else {
    item(text(lang, "Path", "路径"), marker.path);
    item("id", marker.contents?.id || "-");
    item("packageDir", marker.contents?.packageDir || "-");
    if (marker.issues.length > 0) {
      item(text(lang, "Issues", "问题"), marker.issues.join("; "));
    } else {
      item(text(lang, "Status", "状态"), text(lang, "ok", "正常"));
    }
  }

  section(text(lang, "Codex global state", "Codex 全局状态"));
  const state = result.codexState;
  item(text(lang, "Path", "路径"), state.statePath);
  if (!state.exists) {
    item(text(lang, "Status", "状态"), text(lang, "missing", "缺失"));
  } else if (!state.readable) {
    item(text(lang, "Status", "状态"), `${text(lang, "unreadable", "无法读取")} (${state.error})`);
  } else if (!state.validJson) {
    item(text(lang, "Status", "状态"), `${text(lang, "invalid JSON", "JSON 无效")} (${state.error})`);
  } else {
    item(text(lang, "Status", "状态"), state.writable
      ? text(lang, "readable and writable", "可读写")
      : text(lang, "readable but not writable", "可读但不可写"));
    item(text(lang, "Persisted state", "持久化状态"), state.hasPersistedState
      ? text(lang, "found", "已找到")
      : text(lang, "missing", "缺失"));
    if (state.knownKeys.length > 0) {
      console.log(`  ${text(lang, "Known pet-selection keys", "已知宠物选择键")}:`);
      for (const item of state.knownKeys) {
        console.log(`    ${item.key}: ${JSON.stringify(item.value)}`);
      }
    } else {
      item(text(lang, "Known pet-selection keys", "已知宠物选择键"), text(lang, "none", "无"));
    }
  }

  if (result.errors.length > 0) {
    section(text(lang, "Errors", "错误"));
    for (const error of result.errors) {
      bullet(error);
    }
  }
  if (result.warnings.length > 0) {
    section(text(lang, "Warnings", "警告"));
    for (const warning of result.warnings) {
      bullet(warning);
    }
  }

  if (result.errors.length === 0 && result.warnings.length === 0) {
    section(text(lang, "Result", "结果"));
    console.log(text(lang, "No common activation problems found.", "未发现常见启用问题。"));
  } else {
    section(text(lang, "Fallback guidance", "兜底操作"));
    printManualActivationGuidance(marker.contents?.id || "<pet-id>", lang);
  }
}

function printWarnings(warnings = [], lang = "en") {
  for (const warning of warnings) {
    printWarning(warning, lang);
  }
}

function printWarning(warning, lang = "en") {
  console.warn(`${text(lang, "warning", "警告")}: ${warning}`);
}

function printEnableCommand(petId, lang) {
  section(text(lang, "Next step: select the pet in Codex", "下一步：在 Codex 中选择宠物"));
  printManualActivationGuidance(petId, lang);
  section(text(lang, "Optional automation", "可选自动化"));
  console.log(`    npx awesome-codex-pets apply ${petId}`);
}

function printManualActivationGuidance(petId, lang) {
  bullet(text(
    lang,
    `Open Codex Desktop -> File -> Settings -> Appearance -> Pet, then choose "${petId}".`,
    `打开 Codex Desktop -> File -> Settings -> Appearance -> Pet，然后选择 "${petId}"。`
  ));
  bullet(text(
    lang,
    "Wake Codex Desktop after selecting it. Restart Codex Desktop only if the pet still does not appear.",
    "选择后唤醒 Codex Desktop；如果宠物仍未出现，再重启 Codex Desktop。"
  ));
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

function printHelp(lang) {
  console.log(lang === "zh" ? `awesome-codex-pets

用法:
  awesome-codex-pets list [--category <id>] [--json]
  awesome-codex-pets list --installed [--codex-home <path>]
  awesome-codex-pets show <pet-id> [--json]
  awesome-codex-pets install <pet-id|all> [--force] [--apply] [--codex-home <path>]
  awesome-codex-pets apply <pet-id> [--force] [--codex-home <path>]
  awesome-codex-pets add-pet <init|import|finalize> [...]
  awesome-codex-pets doctor [--codex-home <path>] [--json]
  awesome-codex-pets where [--codex-home <path>] [--json]
  awesome-codex-pets validate

语言:
  自动根据系统语言选择。也可以使用 --lang zh|en 或 AWESOME_CODEX_PETS_LANG=zh。

别名:
  npx awesome-codex-pets <command>
  npx codex-pets <command>
` : `awesome-codex-pets

Usage:
  awesome-codex-pets list [--category <id>] [--json]
  awesome-codex-pets list --installed [--codex-home <path>]
  awesome-codex-pets show <pet-id> [--json]
  awesome-codex-pets install <pet-id|all> [--force] [--apply] [--codex-home <path>]
  awesome-codex-pets apply <pet-id> [--force] [--codex-home <path>]
  awesome-codex-pets add-pet <init|import|finalize> [...]
  awesome-codex-pets doctor [--codex-home <path>] [--json]
  awesome-codex-pets where [--codex-home <path>] [--json]
  awesome-codex-pets validate

Language:
  Auto-detected from your system. Override with --lang zh|en or AWESOME_CODEX_PETS_LANG=en.

Aliases:
  npx awesome-codex-pets <command>
  npx codex-pets <command>
`);
}

function printAddPetHelp(lang) {
  console.log(lang === "zh" ? `awesome-codex-pets add-pet

用法:
  awesome-codex-pets add-pet init <pet-name> [--author <name-or-profile>] [--author-handle <handle>] [--category <name-or-id>]
  awesome-codex-pets add-pet import [path|pet-id] [--draft <pet-id>|--pet-id <pet-id>] [--author <name-or-profile>] [--codex-home <path>] [--force]
  awesome-codex-pets add-pet finalize <pet-id> [--force]

示例:
  npx awesome-codex-pets add-pet init mahiro --author lingxiaotian
  npx awesome-codex-pets add-pet import --draft mahiro--lingxiaotian
  npx awesome-codex-pets add-pet import boilbyte --author kongsiyu
  npx awesome-codex-pets add-pet import ~/.codex/pets/mahiro --draft mahiro--lingxiaotian
  npx awesome-codex-pets add-pet finalize mahiro--lingxiaotian
` : `awesome-codex-pets add-pet

Usage:
  awesome-codex-pets add-pet init <pet-name> [--author <name-or-profile>] [--author-handle <handle>] [--category <name-or-id>]
  awesome-codex-pets add-pet import [path|pet-id] [--draft <pet-id>|--pet-id <pet-id>] [--author <name-or-profile>] [--codex-home <path>] [--force]
  awesome-codex-pets add-pet finalize <pet-id> [--force]

Examples:
  npx awesome-codex-pets add-pet init mahiro --author lingxiaotian
  npx awesome-codex-pets add-pet import --draft mahiro--lingxiaotian
  npx awesome-codex-pets add-pet import boilbyte --author kongsiyu
  npx awesome-codex-pets add-pet import ~/.codex/pets/mahiro --draft mahiro--lingxiaotian
  npx awesome-codex-pets add-pet finalize mahiro--lingxiaotian
`);
}
