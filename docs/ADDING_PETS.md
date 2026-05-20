# Adding Pets

The preferred contribution workflow keeps incomplete metadata out of `pets/`
until the pet package is ready.

1. Create a draft:

```bash
npx awesome-codex-pets add-pet init <pet-name> --author <author-or-profile>
```

Drafts are written under `.codex-pets/drafts/<pet-id>/submission.json`. The
draft can start with partial metadata. `init` reuses author defaults from
existing `submission.json` files when possible. If `--author-handle <handle>` is
provided, `author_url` defaults to `https://github.com/<handle>`.

`init` does not generate the pet. Its job is to reserve the repository package
id and capture metadata. Hatch Pet usually writes generated packages to
`${CODEX_HOME:-~/.codex}/pets/<generated-id>/`; `import` knows how to look there
by default.

2. Create or generate the pet files.

Any source is acceptable when it produces a Codex pet package:

```text
pet.json
spritesheet.webp
```

`hatch-pet` run directories with `pet_request.json` and
`final/spritesheet.webp` can also be imported.

3. Import the package:

```bash
npx awesome-codex-pets add-pet import --draft <pet-id>
```

With `--draft <pet-id>`, import first checks
`${CODEX_HOME:-~/.codex}/pets/<pet-id>`. If the draft has a different
`pet_slug`, it also checks `${CODEX_HOME:-~/.codex}/pets/<pet_slug>`, which
matches Hatch Pet runs that were generated before the final repository id was
known.

When importing a Hatch Pet package without a draft, pass author information so
the repository package id can include the author suffix:

```bash
npx awesome-codex-pets add-pet import <generated-id> --author <author-or-profile>
```

For example, `import boilbyte --author kongsiyu` reads
`${CODEX_HOME:-~/.codex}/pets/boilbyte` and writes
`pets/boilbyte--kongsiyu/`.

Pass an explicit path only when the package lives somewhere else:

```bash
npx awesome-codex-pets add-pet import ./local-output --draft <pet-id>
npx awesome-codex-pets add-pet import ~/.codex/pets/<generated-id> --draft <pet-id>
```

Import validates the manifest and atlas dimensions, writes the final package
under `pets/<pet-id>/`, copies `submission.json`, and normalizes `pet.json` so
its `id` and `spritesheetPath` match the repository package.

4. Finalize generated files:

```bash
npx awesome-codex-pets add-pet finalize <pet-id>
```

Finalize runs catalog sync, preview GIF generation for that pet, README gallery
updates, and catalog validation. It prints the files to review before opening a
pull request.

Manual maintenance commands remain available:

```bash
npm run catalog:sync
npm run previews -- --pet <pet-id> --force
npm run readme
npm run validate
```

Example catalog entry:

```json
{
  "id": "firefly--lingxiaotian",
  "name": "Firefly",
  "description": "A compact animated Codex pet.",
  "category": "anime-characters",
  "tags": ["Anime Characters"],
  "author": {
    "name": "legeling",
    "url": "https://github.com/legeling"
  },
  "url": "https://github.com/huaqingai/awesome-codex-pets/tree/main/pets/firefly--lingxiaotian"
}
```

Useful commands:

```bash
npx awesome-codex-pets add-pet init firefly --author lingxiaotian
npx awesome-codex-pets add-pet import --draft firefly--lingxiaotian
npx awesome-codex-pets add-pet finalize firefly--lingxiaotian
npx awesome-codex-pets install firefly--lingxiaotian --force
npx awesome-codex-pets apply firefly--lingxiaotian
```
