#!/usr/bin/env node
import { generatePreviewGifs } from "../src/preview-gifs.js";

const options = parseArgs(process.argv.slice(2));

generatePreviewGifs(options)
  .then((results) => {
    if (results.length === 0) {
      console.log("No pets in catalog; no previews generated.");
      return;
    }
    for (const result of results) {
      const status = result.skipped ? "skipped" : "wrote";
      console.log(`${status}: ${result.petId}/${result.state} -> ${result.outputPath}`);
    }
  })
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });

function parseArgs(args) {
  const options = { petIds: [], states: undefined, force: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--force") {
      options.force = true;
    } else if (arg === "--pet") {
      options.petIds.push(...splitList(args[++index]));
    } else if (arg.startsWith("--pet=")) {
      options.petIds.push(...splitList(arg.slice("--pet=".length)));
    } else if (arg === "--states") {
      options.states = args[++index];
    } else if (arg.startsWith("--states=")) {
      options.states = arg.slice("--states=".length);
    } else if (arg === "--out") {
      options.outDir = args[++index];
    } else if (arg.startsWith("--out=")) {
      options.outDir = arg.slice("--out=".length);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return options;
}

function splitList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
