import fs from "node:fs/promises";
import path from "node:path";
import gifenc from "gifenc";
import {
  ATLAS_HEIGHT,
  ATLAS_WIDTH,
  CELL_HEIGHT,
  CELL_WIDTH,
  getState,
  normalizeStateList
} from "./animation.js";
import { petPackagePath, readCatalog } from "./catalog.js";
import { packageRoot } from "./paths.js";

const { GIFEncoder, applyPalette, quantize } = gifenc;

export async function generatePreviewGifs({
  root = packageRoot(),
  petIds = [],
  states,
  outDir = "assets/previews",
  force = false
} = {}) {
  const catalog = await readCatalog(root);
  const wantedStates = normalizeStateList(states);
  const wantedPets = petIds.length
    ? (catalog.pets || []).filter((pet) => petIds.includes(pet.id))
    : catalog.pets || [];

  const missing = petIds.filter((id) => !wantedPets.some((pet) => pet.id === id));
  if (missing.length > 0) {
    throw new Error(`Pet not found in catalog: ${missing.join(", ")}`);
  }

  if (wantedPets.length === 0) {
    return [];
  }

  const sharp = await loadSharp();
  const results = [];
  for (const pet of wantedPets) {
    const packageDir = petPackagePath(root, pet);
    const atlasPath = path.join(packageDir, "spritesheet.webp");
    const outputDir = path.join(root, outDir, pet.id);
    await fs.mkdir(outputDir, { recursive: true });

    const { data, info } = await sharp(atlasPath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    if (info.width !== ATLAS_WIDTH || info.height !== ATLAS_HEIGHT || info.channels !== 4) {
      throw new Error(
        `${pet.id} atlas must be ${ATLAS_WIDTH}x${ATLAS_HEIGHT} RGBA, got ${info.width}x${info.height} channels=${info.channels}`
      );
    }

    for (const stateId of wantedStates) {
      const state = getState(stateId);
      const outputPath = path.join(outputDir, `${state.id}.gif`);
      if (!force && await exists(outputPath)) {
        results.push({ petId: pet.id, state: state.id, outputPath, skipped: true });
        continue;
      }
      await writeStateGif({ atlasData: data, state, outputPath });
      results.push({ petId: pet.id, state: state.id, outputPath, skipped: false });
    }
  }

  return results;
}

async function writeStateGif({ atlasData, state, outputPath }) {
  const frames = [];
  const sourceStride = ATLAS_WIDTH * 4;

  for (let frame = 0; frame < state.frames; frame += 1) {
    const x = frame * CELL_WIDTH;
    const y = state.row * CELL_HEIGHT;
    const frameData = Buffer.alloc(CELL_WIDTH * CELL_HEIGHT * 4);
    for (let row = 0; row < CELL_HEIGHT; row += 1) {
      const sourceStart = (y + row) * sourceStride + x * 4;
      const sourceEnd = sourceStart + CELL_WIDTH * 4;
      atlasData.copy(frameData, row * CELL_WIDTH * 4, sourceStart, sourceEnd);
    }
    frames.push(frameData);
  }

  const palette = quantize(Buffer.concat(frames), 256, {
    format: "rgba4444",
    oneBitAlpha: 1,
    clearAlpha: true
  });
  const transparentIndex = ensureTransparentIndex(palette);
  const gif = GIFEncoder();

  for (let index = 0; index < frames.length; index += 1) {
    const indexed = applyPalette(frames[index], palette, "rgba4444");
    gif.writeFrame(indexed, CELL_WIDTH, CELL_HEIGHT, {
      palette: index === 0 ? palette : undefined,
      transparent: true,
      transparentIndex,
      delay: state.durations[index],
      repeat: 0,
      dispose: 2
    });
  }

  gif.finish();
  await fs.writeFile(outputPath, gif.bytes());
}

function ensureTransparentIndex(palette) {
  const index = palette.findIndex((color) => (color[3] ?? 255) === 0);
  if (index !== -1) {
    return index;
  }
  if (palette.length >= 256) {
    palette[0] = [0, 0, 0, 0];
    return 0;
  }
  palette.unshift([0, 0, 0, 0]);
  return 0;
}

async function loadSharp() {
  try {
    const module = await import("sharp");
    return module.default;
  } catch (error) {
    throw new Error(
      `Preview GIF generation requires the optional "sharp" package. Run "npm install" first. Original error: ${error.message}`
    );
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
