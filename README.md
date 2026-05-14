# Awesome Codex Pets

Ready-to-install pet packages for Codex Desktop, with a small `npx` CLI and
scripts for catalog validation, preview GIF generation, and README gallery
updates.

This repository is intentionally scaffold-only right now: the library shape,
installer, catalog, and rendering pipeline are ready, but no pet packages have
been added yet.

## Usage

List available pets:

```bash
npx awesome-codex-pets list
```

Install a pet into Codex:

```bash
npx awesome-codex-pets install <pet-id>
```

Install and mark it as active:

```bash
npx awesome-codex-pets apply <pet-id>
```

Direct install from GitHub raw files:

```bash
curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- <pet-id>
```

Codex loads custom pets from `${CODEX_HOME:-$HOME/.codex}/pets/<pet-id>`.
`apply` installs the package and writes an active marker at
`${CODEX_HOME:-$HOME/.codex}/pets/.active-pet.json`. If a Codex Desktop build
does not expose a writable pet-selection setting, choose the installed pet from
Codex's UI after installation.

## Pet Catalog

<!-- PET_CATALOG_START -->
_No pets have been added yet._
<!-- PET_CATALOG_END -->

## Maintainer Workflow

Add a pet package under `pets/<pet-id>/`:

```text
pets/<pet-id>/
  pet.json
  spritesheet.webp
```

Then add the catalog entry in `catalog/pets.json`, generate previews, update
the README gallery, and validate:

```bash
npm install
npm run previews
npm run readme
npm run validate
```

The preview generator reads the Codex atlas contract: `1536x1872`, `8x9`
grid, `192x208` cells, transparent background. It writes one GIF per state to
`assets/previews/<pet-id>/<state>.gif`.

See [docs/PET_FORMAT.md](docs/PET_FORMAT.md) and
[docs/ADDING_PETS.md](docs/ADDING_PETS.md) for the package and contribution
details.
