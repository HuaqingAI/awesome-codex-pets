# Roadmap

This roadmap focuses on making Awesome Codex Pets easier to use after install
and easier to extend with new pets. Version numbers are planning targets and may
shift as Codex Desktop pet behavior evolves.

## v0.2.0 - Install And Activation Experience

Many users do not yet know where Codex Desktop pets are enabled, why an
installed pet might not appear immediately, or whether they need to restart or
wake Codex after selecting one. v0.2.0 should make that path explicit.

Planned work:

- Improve `install <id>` output so it clearly reports the install path and the
  next command to enable the pet.
- Improve `apply <id>` output so it distinguishes these states:
  - pet package installed or already present
  - `.active-pet.json` marker written
  - known Codex persisted state key updated, or no writable known key found
  - manual Codex UI action still needed
- Add `doctor` to diagnose common activation problems:
  - resolved `CODEX_HOME`
  - installed pet directories
  - invalid or missing `pet.json` / `spritesheet.webp`
  - active marker contents
  - readable Codex global state file
  - whether a known pet-selection state key exists
- Add concise fallback guidance when full automation is not possible, including
  where to select the pet in Codex Desktop and when a Codex restart may be
  required.
- Avoid force-restarting Codex by default. Any future restart behavior should be
  explicit, opt-in, and clearly labeled.

Important clarification: `apply <id>` already ensures the pet is installed by
calling the install path when needed. The v0.2.0 work is not about duplicating
that copy step. It is about making activation state visible, automating the
parts that are stable, and giving useful instructions for the parts that are
not stable yet.

## v0.3.0 - Codex-First Pet Development Workflow

Adding pets should be optimized for people building pets with Codex itself.
The preferred creation path should use Codex's `$hatch-pet` skill rather than
reimplementing sprite generation in this repository.

Planned `add-pet` workflow:

```bash
codex-pets add-pet init
codex-pets add-pet import <path>
codex-pets add-pet finalize <pet-id>
```

`add-pet init` should:

- collect pet name, author, category, tags, source, and license metadata
- create or update `pets/<pet-id>/submission.json`
- generate a ready-to-use prompt for Codex that asks it to use `$hatch-pet`
- explain the expected output files: `pet.json` and `spritesheet.webp`

`add-pet import <path>` should:

- copy `pet.json` and `spritesheet.webp` from a hatch-pet output directory or
  from `$CODEX_HOME/pets/<pet-id>`
- validate the manifest and atlas dimensions
- preserve source metadata and avoid overwriting unrelated pet packages

`add-pet finalize <pet-id>` should:

- run `npm run catalog:sync`
- run `npm run previews -- --pet <pet-id> --force`
- run `npm run readme`
- run `npm run validate`
- print the files that should be reviewed before opening a pull request

Supporting work:

- Add a contribution checklist for pet licensing, source attribution, and visual
  QA expectations.
- Add CI checks that fail when `catalog/pets.json`, preview GIFs, or README
  gallery output is stale.
- Consider PR automation that summarizes newly added pets and missing metadata.

## v0.4.0 - Discovery And Maintenance

Once installation and contribution flows are solid, improve catalog discovery
and ongoing maintenance.

Potential work:

- Add `search` and richer `list` filters for category, author, and tags.
- Add `list --json` fields for tags, author, install status, and package path.
- Add `install all --category <id>`.
- Add `update` for installed pets.
- Add a lightweight web gallery, likely through GitHub Pages, with previews and
  install commands.
- Improve release notes so new pets are listed automatically.

## Later

The npm package currently includes pet spritesheets and preview GIFs directly.
That keeps first-run install simple, but it makes the package large. After the
core workflow is proven, evaluate splitting distribution into a smaller CLI plus
remote pet assets fetched on demand from GitHub releases or another stable
artifact host.
