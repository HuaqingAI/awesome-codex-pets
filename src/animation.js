export const CELL_WIDTH = 192;
export const CELL_HEIGHT = 208;
export const ATLAS_COLUMNS = 8;
export const ATLAS_ROWS = 9;
export const ATLAS_WIDTH = CELL_WIDTH * ATLAS_COLUMNS;
export const ATLAS_HEIGHT = CELL_HEIGHT * ATLAS_ROWS;

export const STATES = [
  {
    id: "idle",
    label: "Idle",
    row: 0,
    frames: 6,
    durations: [280, 110, 110, 140, 140, 320]
  },
  {
    id: "running-right",
    label: "Running Right",
    row: 1,
    frames: 8,
    durations: [120, 120, 120, 120, 120, 120, 120, 220]
  },
  {
    id: "running-left",
    label: "Running Left",
    row: 2,
    frames: 8,
    durations: [120, 120, 120, 120, 120, 120, 120, 220]
  },
  {
    id: "waving",
    label: "Waving",
    row: 3,
    frames: 4,
    durations: [140, 140, 140, 280]
  },
  {
    id: "jumping",
    label: "Jumping",
    row: 4,
    frames: 5,
    durations: [140, 140, 140, 140, 280]
  },
  {
    id: "failed",
    label: "Failed",
    row: 5,
    frames: 8,
    durations: [140, 140, 140, 140, 140, 140, 140, 240]
  },
  {
    id: "waiting",
    label: "Waiting",
    row: 6,
    frames: 6,
    durations: [150, 150, 150, 150, 150, 260]
  },
  {
    id: "running",
    label: "Running",
    row: 7,
    frames: 6,
    durations: [120, 120, 120, 120, 120, 220]
  },
  {
    id: "review",
    label: "Review",
    row: 8,
    frames: 6,
    durations: [150, 150, 150, 150, 150, 280]
  }
];

export const README_PREVIEW_STATES = ["idle", "waving", "running", "waiting", "review"];

export function getState(id) {
  const state = STATES.find((item) => item.id === id);
  if (!state) {
    throw new Error(`Unknown animation state: ${id}`);
  }
  return state;
}

export function normalizeStateList(value, fallback = STATES.map((state) => state.id)) {
  if (!value) {
    return fallback;
  }
  const ids = Array.isArray(value)
    ? value.flatMap((item) => String(item).split(","))
    : String(value).split(",");
  return ids
    .map((id) => id.trim())
    .filter(Boolean)
    .map((id) => getState(id).id);
}
