# Adding Pets

1. Create a package folder under `pets/<pet-id>/`.
2. Add `pet.json` and `spritesheet.webp`.
3. Add metadata to `catalog/pets.json`.
4. Run `npm run previews` to render per-state GIFs.
5. Run `npm run readme` to update the gallery block.
6. Run `npm run validate`.

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
npm run validate
npm run previews -- --pet firefly--lingxiaotian --force
npm run readme
npx awesome-codex-pets install firefly--lingxiaotian --force
npx awesome-codex-pets apply firefly--lingxiaotian
```
