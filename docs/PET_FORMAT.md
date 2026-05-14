# Pet Package Format

Each pet package lives under `pets/<pet-id>/`.

```text
pets/<pet-id>/
  pet.json
  spritesheet.webp
```

`pet.json` is the Codex custom pet manifest:

```json
{
  "id": "pet-id",
  "displayName": "Pet Name",
  "description": "One short sentence.",
  "spritesheetPath": "spritesheet.webp"
}
```

Codex loads installed custom pets from:

```text
${CODEX_HOME:-$HOME/.codex}/pets/<pet-id>/
  pet.json
  spritesheet.webp
```

## Sprite Atlas Contract

- Format: WebP.
- Dimensions: `1536x1872`.
- Grid: `8` columns x `9` rows.
- Cell size: `192x208`.
- Background: transparent.
- Unused cells after each state's last frame must be fully transparent.

| Row | State | Used columns | Durations |
| --- | --- | ---: | --- |
| 0 | idle | 0-5 | 280, 110, 110, 140, 140, 320 ms |
| 1 | running-right | 0-7 | 120 ms each, final 220 ms |
| 2 | running-left | 0-7 | 120 ms each, final 220 ms |
| 3 | waving | 0-3 | 140 ms each, final 280 ms |
| 4 | jumping | 0-4 | 140 ms each, final 280 ms |
| 5 | failed | 0-7 | 140 ms each, final 240 ms |
| 6 | waiting | 0-5 | 150 ms each, final 260 ms |
| 7 | running | 0-5 | 120 ms each, final 220 ms |
| 8 | review | 0-5 | 150 ms each, final 280 ms |

The README gallery uses a smaller subset by default: `idle`, `waving`,
`running`, `waiting`, and `review`. The preview script can still render all
nine states.
