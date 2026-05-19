# Awesome Codex Pets

[English](README.md) | [简体中文](README_zh.md)

Ready-to-install pet packages for Codex Desktop, with a small `npx` CLI and
scripts for catalog validation, preview GIF generation, and README gallery
updates.

The catalog is generated from pet packages under `pets/`, then rendered into a
README gallery with install commands and animated previews.

## Usage

The CLI auto-detects your system language. You can override it with
`--lang en`, `--lang zh`, or `AWESOME_CODEX_PETS_LANG`.

List available pets:

```bash
npx awesome-codex-pets list
```

Install a pet into Codex:

```bash
npx awesome-codex-pets install <pet-id>
```

The install command prints the resolved install path and the manual activation
path: Codex Desktop -> File -> Settings -> Appearance -> Pet. Choose the pet
there, then wake Codex Desktop.

Optionally try best-effort automatic activation:

```bash
npx awesome-codex-pets apply <pet-id>
```

`apply` ensures the package is installed, writes the active marker, and tries
to update known Codex persisted selection keys such as `selected-avatar-id`
when they exist and are writable. Some Codex Desktop builds do not react to
that state write immediately, so the UI path above remains the reliable
fallback.

Diagnose common activation problems:

```bash
npx awesome-codex-pets doctor
```

Start a pet contribution draft:

```bash
npx awesome-codex-pets add-pet init <pet-name> --author <author-or-profile>
```

Import a finished pet package or hatch-pet output:

```bash
npx awesome-codex-pets add-pet import --draft <pet-id>
```

Finalize generated catalog, previews, README gallery, and validation:

```bash
npx awesome-codex-pets add-pet finalize <pet-id>
```

Direct install from GitHub raw files:

```bash
curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- <pet-id>
```

Codex loads custom pets from `${CODEX_HOME:-$HOME/.codex}/pets/<pet-id>`.
After installation, open Codex Desktop -> File -> Settings -> Appearance -> Pet
and choose the installed pet, then wake Codex Desktop. If the pet still does
not appear after selection, restart Codex Desktop. `apply` is optional and
best-effort; if it does not switch the visible pet, use the same UI path.

## Pet Catalog

<!-- PET_CATALOG_START -->
### Mascots

<table>
  <tr>
    <th>Name</th>
    <td colspan="5"><a href="https://github.com/HuaqingAI/awesome-codex-pets/tree/main/pets/boilbyte--kongsiyu">Boilbyte</a> - by <a href="https://github.com/kongsiyu">@kongsiyu</a> - Mascots</td>
  </tr>
  <tr>
    <th>Install</th>
    <td colspan="5"><code>npx awesome-codex-pets install boilbyte--kongsiyu</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- boilbyte--kongsiyu</code></td>
  </tr>
  <tr>
    <th>Action</th>
    <th>Idle</th><th>Waving</th><th>Running</th><th>Waiting</th><th>Review</th>
  </tr>
  <tr>
    <th>Preview</th>
    <td><img src="assets/previews/boilbyte--kongsiyu/idle.gif" alt="Boilbyte Idle" width="96" /></td><td><img src="assets/previews/boilbyte--kongsiyu/waving.gif" alt="Boilbyte Waving" width="96" /></td><td><img src="assets/previews/boilbyte--kongsiyu/running.gif" alt="Boilbyte Running" width="96" /></td><td><img src="assets/previews/boilbyte--kongsiyu/waiting.gif" alt="Boilbyte Waiting" width="96" /></td><td><img src="assets/previews/boilbyte--kongsiyu/review.gif" alt="Boilbyte Review" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>Name</th>
    <td colspan="5"><a href="https://github.com/HuaqingAI/awesome-codex-pets/tree/main/pets/byteneko--huaqingai">ByteNeko</a> - by <a href="https://github.com/HuaqingAI">@HuaqingAI</a> - Mascots</td>
  </tr>
  <tr>
    <th>Install</th>
    <td colspan="5"><code>npx awesome-codex-pets install byteneko--huaqingai</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- byteneko--huaqingai</code></td>
  </tr>
  <tr>
    <th>Action</th>
    <th>Idle</th><th>Waving</th><th>Running</th><th>Waiting</th><th>Review</th>
  </tr>
  <tr>
    <th>Preview</th>
    <td><img src="assets/previews/byteneko--huaqingai/idle.gif" alt="ByteNeko Idle" width="96" /></td><td><img src="assets/previews/byteneko--huaqingai/waving.gif" alt="ByteNeko Waving" width="96" /></td><td><img src="assets/previews/byteneko--huaqingai/running.gif" alt="ByteNeko Running" width="96" /></td><td><img src="assets/previews/byteneko--huaqingai/waiting.gif" alt="ByteNeko Waiting" width="96" /></td><td><img src="assets/previews/byteneko--huaqingai/review.gif" alt="ByteNeko Review" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>Name</th>
    <td colspan="5"><a href="https://github.com/HuaqingAI/awesome-codex-pets/tree/main/pets/code-wisp--huaqingai">Code Wisp</a> - by <a href="https://github.com/HuaqingAI">@HuaqingAI</a> - Mascots</td>
  </tr>
  <tr>
    <th>Install</th>
    <td colspan="5"><code>npx awesome-codex-pets install code-wisp--huaqingai</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- code-wisp--huaqingai</code></td>
  </tr>
  <tr>
    <th>Action</th>
    <th>Idle</th><th>Waving</th><th>Running</th><th>Waiting</th><th>Review</th>
  </tr>
  <tr>
    <th>Preview</th>
    <td><img src="assets/previews/code-wisp--huaqingai/idle.gif" alt="Code Wisp Idle" width="96" /></td><td><img src="assets/previews/code-wisp--huaqingai/waving.gif" alt="Code Wisp Waving" width="96" /></td><td><img src="assets/previews/code-wisp--huaqingai/running.gif" alt="Code Wisp Running" width="96" /></td><td><img src="assets/previews/code-wisp--huaqingai/waiting.gif" alt="Code Wisp Waiting" width="96" /></td><td><img src="assets/previews/code-wisp--huaqingai/review.gif" alt="Code Wisp Review" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>Name</th>
    <td colspan="5"><a href="https://github.com/HuaqingAI/awesome-codex-pets/tree/main/pets/natural-selection--huaqingai">Natural Selection</a> - by <a href="https://github.com/HuaqingAI">@HuaqingAI</a> - Mascots</td>
  </tr>
  <tr>
    <th>Install</th>
    <td colspan="5"><code>npx awesome-codex-pets install natural-selection--huaqingai</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- natural-selection--huaqingai</code></td>
  </tr>
  <tr>
    <th>Action</th>
    <th>Idle</th><th>Waving</th><th>Running</th><th>Waiting</th><th>Review</th>
  </tr>
  <tr>
    <th>Preview</th>
    <td><img src="assets/previews/natural-selection--huaqingai/idle.gif" alt="Natural Selection Idle" width="96" /></td><td><img src="assets/previews/natural-selection--huaqingai/waving.gif" alt="Natural Selection Waving" width="96" /></td><td><img src="assets/previews/natural-selection--huaqingai/running.gif" alt="Natural Selection Running" width="96" /></td><td><img src="assets/previews/natural-selection--huaqingai/waiting.gif" alt="Natural Selection Waiting" width="96" /></td><td><img src="assets/previews/natural-selection--huaqingai/review.gif" alt="Natural Selection Review" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>Name</th>
    <td colspan="5"><a href="https://github.com/HuaqingAI/awesome-codex-pets/tree/main/pets/neon-shell--huaqingai">Neon Shell</a> - by <a href="https://github.com/HuaqingAI">@HuaqingAI</a> - Mascots</td>
  </tr>
  <tr>
    <th>Install</th>
    <td colspan="5"><code>npx awesome-codex-pets install neon-shell--huaqingai</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- neon-shell--huaqingai</code></td>
  </tr>
  <tr>
    <th>Action</th>
    <th>Idle</th><th>Waving</th><th>Running</th><th>Waiting</th><th>Review</th>
  </tr>
  <tr>
    <th>Preview</th>
    <td><img src="assets/previews/neon-shell--huaqingai/idle.gif" alt="Neon Shell Idle" width="96" /></td><td><img src="assets/previews/neon-shell--huaqingai/waving.gif" alt="Neon Shell Waving" width="96" /></td><td><img src="assets/previews/neon-shell--huaqingai/running.gif" alt="Neon Shell Running" width="96" /></td><td><img src="assets/previews/neon-shell--huaqingai/waiting.gif" alt="Neon Shell Waiting" width="96" /></td><td><img src="assets/previews/neon-shell--huaqingai/review.gif" alt="Neon Shell Review" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>Name</th>
    <td colspan="5"><a href="https://github.com/HuaqingAI/awesome-codex-pets/tree/main/pets/sophon--huaqingai">Sophon</a> - by <a href="https://github.com/HuaqingAI">@HuaqingAI</a> - Mascots</td>
  </tr>
  <tr>
    <th>Install</th>
    <td colspan="5"><code>npx awesome-codex-pets install sophon--huaqingai</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- sophon--huaqingai</code></td>
  </tr>
  <tr>
    <th>Action</th>
    <th>Idle</th><th>Waving</th><th>Running</th><th>Waiting</th><th>Review</th>
  </tr>
  <tr>
    <th>Preview</th>
    <td><img src="assets/previews/sophon--huaqingai/idle.gif" alt="Sophon Idle" width="96" /></td><td><img src="assets/previews/sophon--huaqingai/waving.gif" alt="Sophon Waving" width="96" /></td><td><img src="assets/previews/sophon--huaqingai/running.gif" alt="Sophon Running" width="96" /></td><td><img src="assets/previews/sophon--huaqingai/waiting.gif" alt="Sophon Waiting" width="96" /></td><td><img src="assets/previews/sophon--huaqingai/review.gif" alt="Sophon Review" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>Name</th>
    <td colspan="5"><a href="https://github.com/HuaqingAI/awesome-codex-pets/tree/main/pets/waterdrop-probe--huaqingai">Waterdrop Probe</a> - by <a href="https://github.com/HuaqingAI">@HuaqingAI</a> - Mascots</td>
  </tr>
  <tr>
    <th>Install</th>
    <td colspan="5"><code>npx awesome-codex-pets install waterdrop-probe--huaqingai</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- waterdrop-probe--huaqingai</code></td>
  </tr>
  <tr>
    <th>Action</th>
    <th>Idle</th><th>Waving</th><th>Running</th><th>Waiting</th><th>Review</th>
  </tr>
  <tr>
    <th>Preview</th>
    <td><img src="assets/previews/waterdrop-probe--huaqingai/idle.gif" alt="Waterdrop Probe Idle" width="96" /></td><td><img src="assets/previews/waterdrop-probe--huaqingai/waving.gif" alt="Waterdrop Probe Waving" width="96" /></td><td><img src="assets/previews/waterdrop-probe--huaqingai/running.gif" alt="Waterdrop Probe Running" width="96" /></td><td><img src="assets/previews/waterdrop-probe--huaqingai/waiting.gif" alt="Waterdrop Probe Waiting" width="96" /></td><td><img src="assets/previews/waterdrop-probe--huaqingai/review.gif" alt="Waterdrop Probe Review" width="96" /></td>
  </tr>
</table>

### Anime Characters

<table>
  <tr>
    <th>Name</th>
    <td colspan="5"><a href="https://github.com/huaqingai/awesome-codex-pets/tree/main/pets/bocchi--lingxiaotian">Bocchi</a> - by <a href="https://github.com/legeling">@Lingxiaotian</a> - Anime Characters</td>
  </tr>
  <tr>
    <th>Install</th>
    <td colspan="5"><code>npx awesome-codex-pets install bocchi--lingxiaotian</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- bocchi--lingxiaotian</code></td>
  </tr>
  <tr>
    <th>Action</th>
    <th>Idle</th><th>Waving</th><th>Running</th><th>Waiting</th><th>Review</th>
  </tr>
  <tr>
    <th>Preview</th>
    <td><img src="assets/previews/bocchi--lingxiaotian/idle.gif" alt="Bocchi Idle" width="96" /></td><td><img src="assets/previews/bocchi--lingxiaotian/waving.gif" alt="Bocchi Waving" width="96" /></td><td><img src="assets/previews/bocchi--lingxiaotian/running.gif" alt="Bocchi Running" width="96" /></td><td><img src="assets/previews/bocchi--lingxiaotian/waiting.gif" alt="Bocchi Waiting" width="96" /></td><td><img src="assets/previews/bocchi--lingxiaotian/review.gif" alt="Bocchi Review" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>Name</th>
    <td colspan="5"><a href="https://github.com/huaqingai/awesome-codex-pets/tree/main/pets/dnf-female-ammo--qunboo">女弹药Q</a> - by <a href="https://github.com/QunBoo">@QunBoo</a> - Anime Characters</td>
  </tr>
  <tr>
    <th>Install</th>
    <td colspan="5"><code>npx awesome-codex-pets install dnf-female-ammo--qunboo</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- dnf-female-ammo--qunboo</code></td>
  </tr>
  <tr>
    <th>Action</th>
    <th>Idle</th><th>Waving</th><th>Running</th><th>Waiting</th><th>Review</th>
  </tr>
  <tr>
    <th>Preview</th>
    <td><img src="assets/previews/dnf-female-ammo--qunboo/idle.gif" alt="女弹药Q Idle" width="96" /></td><td><img src="assets/previews/dnf-female-ammo--qunboo/waving.gif" alt="女弹药Q Waving" width="96" /></td><td><img src="assets/previews/dnf-female-ammo--qunboo/running.gif" alt="女弹药Q Running" width="96" /></td><td><img src="assets/previews/dnf-female-ammo--qunboo/waiting.gif" alt="女弹药Q Waiting" width="96" /></td><td><img src="assets/previews/dnf-female-ammo--qunboo/review.gif" alt="女弹药Q Review" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>Name</th>
    <td colspan="5"><a href="https://github.com/huaqingai/awesome-codex-pets/tree/main/pets/firefly--lingxiaotian">Firefly</a> - by <a href="https://github.com/legeling">@Lingxiaotian</a> - Anime Characters</td>
  </tr>
  <tr>
    <th>Install</th>
    <td colspan="5"><code>npx awesome-codex-pets install firefly--lingxiaotian</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- firefly--lingxiaotian</code></td>
  </tr>
  <tr>
    <th>Action</th>
    <th>Idle</th><th>Waving</th><th>Running</th><th>Waiting</th><th>Review</th>
  </tr>
  <tr>
    <th>Preview</th>
    <td><img src="assets/previews/firefly--lingxiaotian/idle.gif" alt="Firefly Idle" width="96" /></td><td><img src="assets/previews/firefly--lingxiaotian/waving.gif" alt="Firefly Waving" width="96" /></td><td><img src="assets/previews/firefly--lingxiaotian/running.gif" alt="Firefly Running" width="96" /></td><td><img src="assets/previews/firefly--lingxiaotian/waiting.gif" alt="Firefly Waiting" width="96" /></td><td><img src="assets/previews/firefly--lingxiaotian/review.gif" alt="Firefly Review" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>Name</th>
    <td colspan="5"><a href="https://github.com/huaqingai/awesome-codex-pets/tree/main/pets/frieren--lingxiaotian">Frieren</a> - by <a href="https://github.com/legeling">@Lingxiaotian</a> - Anime Characters</td>
  </tr>
  <tr>
    <th>Install</th>
    <td colspan="5"><code>npx awesome-codex-pets install frieren--lingxiaotian</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- frieren--lingxiaotian</code></td>
  </tr>
  <tr>
    <th>Action</th>
    <th>Idle</th><th>Waving</th><th>Running</th><th>Waiting</th><th>Review</th>
  </tr>
  <tr>
    <th>Preview</th>
    <td><img src="assets/previews/frieren--lingxiaotian/idle.gif" alt="Frieren Idle" width="96" /></td><td><img src="assets/previews/frieren--lingxiaotian/waving.gif" alt="Frieren Waving" width="96" /></td><td><img src="assets/previews/frieren--lingxiaotian/running.gif" alt="Frieren Running" width="96" /></td><td><img src="assets/previews/frieren--lingxiaotian/waiting.gif" alt="Frieren Waiting" width="96" /></td><td><img src="assets/previews/frieren--lingxiaotian/review.gif" alt="Frieren Review" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>Name</th>
    <td colspan="5"><a href="https://github.com/huaqingai/awesome-codex-pets/tree/main/pets/mahiro--lingxiaotian">Mahiro</a> - by <a href="https://github.com/legeling">@Lingxiaotian</a> - Anime Characters</td>
  </tr>
  <tr>
    <th>Install</th>
    <td colspan="5"><code>npx awesome-codex-pets install mahiro--lingxiaotian</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- mahiro--lingxiaotian</code></td>
  </tr>
  <tr>
    <th>Action</th>
    <th>Idle</th><th>Waving</th><th>Running</th><th>Waiting</th><th>Review</th>
  </tr>
  <tr>
    <th>Preview</th>
    <td><img src="assets/previews/mahiro--lingxiaotian/idle.gif" alt="Mahiro Idle" width="96" /></td><td><img src="assets/previews/mahiro--lingxiaotian/waving.gif" alt="Mahiro Waving" width="96" /></td><td><img src="assets/previews/mahiro--lingxiaotian/running.gif" alt="Mahiro Running" width="96" /></td><td><img src="assets/previews/mahiro--lingxiaotian/waiting.gif" alt="Mahiro Waiting" width="96" /></td><td><img src="assets/previews/mahiro--lingxiaotian/review.gif" alt="Mahiro Review" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>Name</th>
    <td colspan="5"><a href="https://github.com/huaqingai/awesome-codex-pets/tree/main/pets/mikoto--lingxiaotian">Mikoto</a> - by <a href="https://github.com/legeling">@Lingxiaotian</a> - Anime Characters</td>
  </tr>
  <tr>
    <th>Install</th>
    <td colspan="5"><code>npx awesome-codex-pets install mikoto--lingxiaotian</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- mikoto--lingxiaotian</code></td>
  </tr>
  <tr>
    <th>Action</th>
    <th>Idle</th><th>Waving</th><th>Running</th><th>Waiting</th><th>Review</th>
  </tr>
  <tr>
    <th>Preview</th>
    <td><img src="assets/previews/mikoto--lingxiaotian/idle.gif" alt="Mikoto Idle" width="96" /></td><td><img src="assets/previews/mikoto--lingxiaotian/waving.gif" alt="Mikoto Waving" width="96" /></td><td><img src="assets/previews/mikoto--lingxiaotian/running.gif" alt="Mikoto Running" width="96" /></td><td><img src="assets/previews/mikoto--lingxiaotian/waiting.gif" alt="Mikoto Waiting" width="96" /></td><td><img src="assets/previews/mikoto--lingxiaotian/review.gif" alt="Mikoto Review" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>Name</th>
    <td colspan="5"><a href="https://github.com/huaqingai/awesome-codex-pets/tree/main/pets/miku--lingxiaotian">Miku</a> - by <a href="https://github.com/legeling">@Lingxiaotian</a> - Anime Characters</td>
  </tr>
  <tr>
    <th>Install</th>
    <td colspan="5"><code>npx awesome-codex-pets install miku--lingxiaotian</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- miku--lingxiaotian</code></td>
  </tr>
  <tr>
    <th>Action</th>
    <th>Idle</th><th>Waving</th><th>Running</th><th>Waiting</th><th>Review</th>
  </tr>
  <tr>
    <th>Preview</th>
    <td><img src="assets/previews/miku--lingxiaotian/idle.gif" alt="Miku Idle" width="96" /></td><td><img src="assets/previews/miku--lingxiaotian/waving.gif" alt="Miku Waving" width="96" /></td><td><img src="assets/previews/miku--lingxiaotian/running.gif" alt="Miku Running" width="96" /></td><td><img src="assets/previews/miku--lingxiaotian/waiting.gif" alt="Miku Waiting" width="96" /></td><td><img src="assets/previews/miku--lingxiaotian/review.gif" alt="Miku Review" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>Name</th>
    <td colspan="5"><a href="https://github.com/huaqingai/awesome-codex-pets/tree/main/pets/paimon--lingxiaotian">Paimon</a> - by <a href="https://github.com/legeling">@Lingxiaotian</a> - Anime Characters</td>
  </tr>
  <tr>
    <th>Install</th>
    <td colspan="5"><code>npx awesome-codex-pets install paimon--lingxiaotian</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- paimon--lingxiaotian</code></td>
  </tr>
  <tr>
    <th>Action</th>
    <th>Idle</th><th>Waving</th><th>Running</th><th>Waiting</th><th>Review</th>
  </tr>
  <tr>
    <th>Preview</th>
    <td><img src="assets/previews/paimon--lingxiaotian/idle.gif" alt="Paimon Idle" width="96" /></td><td><img src="assets/previews/paimon--lingxiaotian/waving.gif" alt="Paimon Waving" width="96" /></td><td><img src="assets/previews/paimon--lingxiaotian/running.gif" alt="Paimon Running" width="96" /></td><td><img src="assets/previews/paimon--lingxiaotian/waiting.gif" alt="Paimon Waiting" width="96" /></td><td><img src="assets/previews/paimon--lingxiaotian/review.gif" alt="Paimon Review" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>Name</th>
    <td colspan="5"><a href="https://github.com/huaqingai/awesome-codex-pets/tree/main/pets/reimu--lingxiaotian">Reimu</a> - by <a href="https://github.com/legeling">@Lingxiaotian</a> - Anime Characters</td>
  </tr>
  <tr>
    <th>Install</th>
    <td colspan="5"><code>npx awesome-codex-pets install reimu--lingxiaotian</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- reimu--lingxiaotian</code></td>
  </tr>
  <tr>
    <th>Action</th>
    <th>Idle</th><th>Waving</th><th>Running</th><th>Waiting</th><th>Review</th>
  </tr>
  <tr>
    <th>Preview</th>
    <td><img src="assets/previews/reimu--lingxiaotian/idle.gif" alt="Reimu Idle" width="96" /></td><td><img src="assets/previews/reimu--lingxiaotian/waving.gif" alt="Reimu Waving" width="96" /></td><td><img src="assets/previews/reimu--lingxiaotian/running.gif" alt="Reimu Running" width="96" /></td><td><img src="assets/previews/reimu--lingxiaotian/waiting.gif" alt="Reimu Waiting" width="96" /></td><td><img src="assets/previews/reimu--lingxiaotian/review.gif" alt="Reimu Review" width="96" /></td>
  </tr>
</table>

### Animals

<table>
  <tr>
    <th>Name</th>
    <td colspan="5"><a href="https://github.com/huaqingai/awesome-codex-pets/tree/main/pets/becky--natewanggg">Becky</a> - by <a href="https://github.com/NateWanggg">@NateWanggg</a> - Animals</td>
  </tr>
  <tr>
    <th>Install</th>
    <td colspan="5"><code>npx awesome-codex-pets install becky--natewanggg</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- becky--natewanggg</code></td>
  </tr>
  <tr>
    <th>Action</th>
    <th>Idle</th><th>Waving</th><th>Running</th><th>Waiting</th><th>Review</th>
  </tr>
  <tr>
    <th>Preview</th>
    <td><img src="assets/previews/becky--natewanggg/idle.gif" alt="Becky Idle" width="96" /></td><td><img src="assets/previews/becky--natewanggg/waving.gif" alt="Becky Waving" width="96" /></td><td><img src="assets/previews/becky--natewanggg/running.gif" alt="Becky Running" width="96" /></td><td><img src="assets/previews/becky--natewanggg/waiting.gif" alt="Becky Waiting" width="96" /></td><td><img src="assets/previews/becky--natewanggg/review.gif" alt="Becky Review" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>Name</th>
    <td colspan="5"><a href="https://github.com/huaqingai/awesome-codex-pets/tree/main/pets/fleta--natewanggg">Fleta</a> - by <a href="https://github.com/NateWanggg">@NateWanggg</a> - Animals</td>
  </tr>
  <tr>
    <th>Install</th>
    <td colspan="5"><code>npx awesome-codex-pets install fleta--natewanggg</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- fleta--natewanggg</code></td>
  </tr>
  <tr>
    <th>Action</th>
    <th>Idle</th><th>Waving</th><th>Running</th><th>Waiting</th><th>Review</th>
  </tr>
  <tr>
    <th>Preview</th>
    <td><img src="assets/previews/fleta--natewanggg/idle.gif" alt="Fleta Idle" width="96" /></td><td><img src="assets/previews/fleta--natewanggg/waving.gif" alt="Fleta Waving" width="96" /></td><td><img src="assets/previews/fleta--natewanggg/running.gif" alt="Fleta Running" width="96" /></td><td><img src="assets/previews/fleta--natewanggg/waiting.gif" alt="Fleta Waiting" width="96" /></td><td><img src="assets/previews/fleta--natewanggg/review.gif" alt="Fleta Review" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>Name</th>
    <td colspan="5"><a href="https://danieloleary.github.io/teddy-v31/">Teddy</a> - by <a href="https://github.com/danieloleary">@Daniel O'Leary</a> - Animals</td>
  </tr>
  <tr>
    <th>Install</th>
    <td colspan="5"><code>npx awesome-codex-pets install teddy--danieloleary</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- teddy--danieloleary</code></td>
  </tr>
  <tr>
    <th>Action</th>
    <th>Idle</th><th>Waving</th><th>Running</th><th>Waiting</th><th>Review</th>
  </tr>
  <tr>
    <th>Preview</th>
    <td><img src="assets/previews/teddy--danieloleary/idle.gif" alt="Teddy Idle" width="96" /></td><td><img src="assets/previews/teddy--danieloleary/waving.gif" alt="Teddy Waving" width="96" /></td><td><img src="assets/previews/teddy--danieloleary/running.gif" alt="Teddy Running" width="96" /></td><td><img src="assets/previews/teddy--danieloleary/waiting.gif" alt="Teddy Waiting" width="96" /></td><td><img src="assets/previews/teddy--danieloleary/review.gif" alt="Teddy Review" width="96" /></td>
  </tr>
</table>

### Original Characters

<table>
  <tr>
    <th>Name</th>
    <td colspan="5"><a href="https://github.com/netizenXuan/night-neko-codex-pet">Night Neko</a> - by <a href="https://github.com/netizenXuan">@netizenXuan</a> - Original Characters</td>
  </tr>
  <tr>
    <th>Install</th>
    <td colspan="5"><code>npx awesome-codex-pets install night-neko--netizenxuan</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- night-neko--netizenxuan</code></td>
  </tr>
  <tr>
    <th>Action</th>
    <th>Idle</th><th>Waving</th><th>Running</th><th>Waiting</th><th>Review</th>
  </tr>
  <tr>
    <th>Preview</th>
    <td><img src="assets/previews/night-neko--netizenxuan/idle.gif" alt="Night Neko Idle" width="96" /></td><td><img src="assets/previews/night-neko--netizenxuan/waving.gif" alt="Night Neko Waving" width="96" /></td><td><img src="assets/previews/night-neko--netizenxuan/running.gif" alt="Night Neko Running" width="96" /></td><td><img src="assets/previews/night-neko--netizenxuan/waiting.gif" alt="Night Neko Waiting" width="96" /></td><td><img src="assets/previews/night-neko--netizenxuan/review.gif" alt="Night Neko Review" width="96" /></td>
  </tr>
</table>
<!-- PET_CATALOG_END -->

## Maintainer Workflow

Add a pet package under `pets/<pet-id>/`:

```text
pets/<pet-id>/
  submission.json
  pet.json
  spritesheet.webp
```

For new contributions, prefer the guided local workflow. `init` writes a draft
under `.codex-pets/drafts/` so an incomplete pet does not break validation.
`import` creates the real `pets/<pet-id>/` package only after `pet.json` and
`spritesheet.webp` are available. `finalize` syncs generated files:

```bash
npm install
npx awesome-codex-pets add-pet init <pet-name> --author <author-or-profile>
npx awesome-codex-pets add-pet import --draft <pet-id>
npx awesome-codex-pets add-pet finalize <pet-id>
```

Manual maintenance still works with `npm run catalog:sync`, `npm run previews`,
`npm run readme`, and `npm run validate`.

## Release Workflow

Publishing is handled by GitHub Actions when a version tag is pushed. Configure
the repository secret `NPM_TOKEN` with an npm automation token that can publish
`awesome-codex-pets`.

For the first release, commit the current `0.1.0` changes and push the matching
tag:

```bash
git push origin main
git tag v0.1.0
git push origin v0.1.0
```

For later releases, bump the version first:

```bash
npm version patch
git push origin main --follow-tags
```

The release workflow requires the tag to match `package.json` exactly, for
example `v0.1.0`. It runs `npm ci`, `npm run build`, checks that generated files
are committed, publishes to npm with provenance, and creates a GitHub Release.

The preview generator reads the Codex atlas contract: `1536x1872`, `8x9`
grid, `192x208` cells, transparent background. It writes one GIF per state to
`assets/previews/<pet-id>/<state>.gif`.

See [docs/PET_FORMAT.md](docs/PET_FORMAT.md) and
[docs/ADDING_PETS.md](docs/ADDING_PETS.md) for the package and contribution
details. See [ROADMAP.md](ROADMAP.md) for planned install, activation, and
pet-development workflow improvements.
