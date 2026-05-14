#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  install-pet.sh <pet-id> [--apply] [--force] [--repo-raw <url>] [--codex-home <path>]

Example:
  curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- firefly--lingxiaotian
EOF
}

if [ "$#" -lt 1 ]; then
  usage
  exit 1
fi

PET_ID="$1"
shift

if [[ ! "$PET_ID" =~ ^[a-z0-9][a-z0-9-]*[a-z0-9]$ ]]; then
  echo "Invalid pet id: $PET_ID" >&2
  echo "Pet ids must use lowercase letters, numbers, and hyphens." >&2
  exit 1
fi

REPO_RAW="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main"
CODEX_HOME_DIR="${CODEX_HOME:-$HOME/.codex}"
APPLY=0
FORCE=0

while [ "$#" -gt 0 ]; do
  case "$1" in
    --apply)
      APPLY=1
      ;;
    --force)
      FORCE=1
      ;;
    --repo-raw)
      shift
      REPO_RAW="${1:-}"
      ;;
    --codex-home)
      shift
      CODEX_HOME_DIR="${1:-}"
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
  shift
done

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required." >&2
  exit 1
fi

DEST_DIR="$CODEX_HOME_DIR/pets/$PET_ID"
if [ -e "$DEST_DIR" ] && [ "$FORCE" -ne 1 ]; then
  echo "$PET_ID is already installed at $DEST_DIR. Use --force to overwrite." >&2
  exit 1
fi

TMP_DIR="$(mktemp -d)"
cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

curl -fsSL "$REPO_RAW/pets/$PET_ID/pet.json" -o "$TMP_DIR/pet.json"
curl -fsSL "$REPO_RAW/pets/$PET_ID/spritesheet.webp" -o "$TMP_DIR/spritesheet.webp"

mkdir -p "$CODEX_HOME_DIR/pets"
if [ -e "$DEST_DIR" ]; then
  rm -rf "$DEST_DIR"
fi
mkdir -p "$DEST_DIR"
cp "$TMP_DIR/pet.json" "$DEST_DIR/pet.json"
cp "$TMP_DIR/spritesheet.webp" "$DEST_DIR/spritesheet.webp"

echo "$PET_ID installed to $DEST_DIR"

if [ "$APPLY" -eq 1 ]; then
  cat > "$CODEX_HOME_DIR/pets/.active-pet.json" <<EOF
{
  "id": "$PET_ID",
  "packageDir": "$DEST_DIR",
  "appliedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "note": "Best-effort marker written by awesome-codex-pets. Some Codex Desktop builds still require selecting the pet in the UI."
}
EOF
  echo "$PET_ID active marker written to $CODEX_HOME_DIR/pets/.active-pet.json"
fi
