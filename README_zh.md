# Awesome Codex Pets

[English](README.md) | [简体中文](README_zh.md)

这是一个 Codex Desktop 宠物仓库，提供可直接安装的宠物包、`npx`
命令行工具、目录校验、预览 GIF 生成和 README 图鉴更新脚本。

npm 包保持轻量：只携带 CLI 和目录元数据，执行 `install` 时再从 GitHub raw
文件按需下载被选中的宠物资源。源码仓库仍保留 `pets/` 下的完整宠物包和
`assets/previews/` 下的预览 GIF。

## 使用

命令行工具会根据系统语言自动选择中文或英文。也可以用 `--lang zh`、
`--lang en` 或 `AWESOME_CODEX_PETS_LANG` 显式指定语言。

查看可用宠物：

```bash
npx awesome-codex-pets list
```

安装宠物到 Codex：

```bash
npx awesome-codex-pets install <pet-id>
```

安装命令只会下载选中的宠物资源，并显示安装位置和下一步操作。安装后请打开
Codex Desktop -> File -> Settings -> Appearance -> Pet，选择刚安装的宠物，
然后唤醒 Codex Desktop。如果选择后仍未显示，再重启 Codex Desktop。

也可以尝试自动应用宠物：

```bash
npx awesome-codex-pets apply <pet-id>
```

`apply` 会确保宠物已安装，写入启用标记，并尝试更新 Codex 已知的持久化
选择键，例如 `selected-avatar-id`。不同 Codex Desktop 版本对这个状态写入
的响应不完全一致，所以手动选择仍然是可靠兜底方式。

诊断常见启用问题：

```bash
npx awesome-codex-pets doctor
```

创建宠物贡献草稿：

```bash
npx awesome-codex-pets add-pet init <pet-name> --author <author-or-profile>
```

导入已完成的宠物包或 Hatch Pet 输出：

```bash
npx awesome-codex-pets add-pet import --draft <pet-id>
```

生成目录、预览、README 图鉴并校验：

```bash
npx awesome-codex-pets add-pet finalize <pet-id>
```

从 GitHub raw 文件直接安装：

```bash
curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- <pet-id>
```

Codex 会从 `${CODEX_HOME:-$HOME/.codex}/pets/<pet-id>` 加载自定义宠物。
安装后，请在 Codex Desktop 的 Appearance -> Pet 设置里选择宠物。

## 宠物图鉴

<!-- PET_CATALOG_START -->
### 吉祥物

<table>
  <tr>
    <th>名称</th>
    <td colspan="5"><a href="https://github.com/HuaqingAI/awesome-codex-pets/tree/main/pets/boilbyte--kongsiyu">Boilbyte</a> - 作者 <a href="https://github.com/kongsiyu">@kongsiyu</a> - 吉祥物</td>
  </tr>
  <tr>
    <th>安装</th>
    <td colspan="5"><code>npx awesome-codex-pets install boilbyte--kongsiyu</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- boilbyte--kongsiyu</code></td>
  </tr>
  <tr>
    <th>动作</th>
    <th>待机</th><th>挥手</th><th>工作</th><th>等待</th><th>审阅</th>
  </tr>
  <tr>
    <th>预览</th>
    <td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/boilbyte--kongsiyu/idle.gif" alt="Boilbyte 待机" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/boilbyte--kongsiyu/waving.gif" alt="Boilbyte 挥手" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/boilbyte--kongsiyu/running.gif" alt="Boilbyte 工作" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/boilbyte--kongsiyu/waiting.gif" alt="Boilbyte 等待" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/boilbyte--kongsiyu/review.gif" alt="Boilbyte 审阅" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>名称</th>
    <td colspan="5"><a href="https://github.com/HuaqingAI/awesome-codex-pets/tree/main/pets/byteneko--huaqingai">ByteNeko</a> - 作者 <a href="https://github.com/HuaqingAI">@HuaqingAI</a> - 吉祥物</td>
  </tr>
  <tr>
    <th>安装</th>
    <td colspan="5"><code>npx awesome-codex-pets install byteneko--huaqingai</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- byteneko--huaqingai</code></td>
  </tr>
  <tr>
    <th>动作</th>
    <th>待机</th><th>挥手</th><th>工作</th><th>等待</th><th>审阅</th>
  </tr>
  <tr>
    <th>预览</th>
    <td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/byteneko--huaqingai/idle.gif" alt="ByteNeko 待机" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/byteneko--huaqingai/waving.gif" alt="ByteNeko 挥手" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/byteneko--huaqingai/running.gif" alt="ByteNeko 工作" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/byteneko--huaqingai/waiting.gif" alt="ByteNeko 等待" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/byteneko--huaqingai/review.gif" alt="ByteNeko 审阅" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>名称</th>
    <td colspan="5"><a href="https://github.com/HuaqingAI/awesome-codex-pets/tree/main/pets/code-wisp--huaqingai">Code Wisp</a> - 作者 <a href="https://github.com/HuaqingAI">@HuaqingAI</a> - 吉祥物</td>
  </tr>
  <tr>
    <th>安装</th>
    <td colspan="5"><code>npx awesome-codex-pets install code-wisp--huaqingai</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- code-wisp--huaqingai</code></td>
  </tr>
  <tr>
    <th>动作</th>
    <th>待机</th><th>挥手</th><th>工作</th><th>等待</th><th>审阅</th>
  </tr>
  <tr>
    <th>预览</th>
    <td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/code-wisp--huaqingai/idle.gif" alt="Code Wisp 待机" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/code-wisp--huaqingai/waving.gif" alt="Code Wisp 挥手" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/code-wisp--huaqingai/running.gif" alt="Code Wisp 工作" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/code-wisp--huaqingai/waiting.gif" alt="Code Wisp 等待" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/code-wisp--huaqingai/review.gif" alt="Code Wisp 审阅" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>名称</th>
    <td colspan="5"><a href="https://github.com/HuaqingAI/awesome-codex-pets/tree/main/pets/natural-selection--huaqingai">Natural Selection</a> - 作者 <a href="https://github.com/HuaqingAI">@HuaqingAI</a> - 吉祥物</td>
  </tr>
  <tr>
    <th>安装</th>
    <td colspan="5"><code>npx awesome-codex-pets install natural-selection--huaqingai</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- natural-selection--huaqingai</code></td>
  </tr>
  <tr>
    <th>动作</th>
    <th>待机</th><th>挥手</th><th>工作</th><th>等待</th><th>审阅</th>
  </tr>
  <tr>
    <th>预览</th>
    <td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/natural-selection--huaqingai/idle.gif" alt="Natural Selection 待机" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/natural-selection--huaqingai/waving.gif" alt="Natural Selection 挥手" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/natural-selection--huaqingai/running.gif" alt="Natural Selection 工作" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/natural-selection--huaqingai/waiting.gif" alt="Natural Selection 等待" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/natural-selection--huaqingai/review.gif" alt="Natural Selection 审阅" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>名称</th>
    <td colspan="5"><a href="https://github.com/HuaqingAI/awesome-codex-pets/tree/main/pets/neon-shell--huaqingai">Neon Shell</a> - 作者 <a href="https://github.com/HuaqingAI">@HuaqingAI</a> - 吉祥物</td>
  </tr>
  <tr>
    <th>安装</th>
    <td colspan="5"><code>npx awesome-codex-pets install neon-shell--huaqingai</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- neon-shell--huaqingai</code></td>
  </tr>
  <tr>
    <th>动作</th>
    <th>待机</th><th>挥手</th><th>工作</th><th>等待</th><th>审阅</th>
  </tr>
  <tr>
    <th>预览</th>
    <td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/neon-shell--huaqingai/idle.gif" alt="Neon Shell 待机" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/neon-shell--huaqingai/waving.gif" alt="Neon Shell 挥手" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/neon-shell--huaqingai/running.gif" alt="Neon Shell 工作" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/neon-shell--huaqingai/waiting.gif" alt="Neon Shell 等待" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/neon-shell--huaqingai/review.gif" alt="Neon Shell 审阅" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>名称</th>
    <td colspan="5"><a href="https://github.com/HuaqingAI/awesome-codex-pets/tree/main/pets/sophon--huaqingai">Sophon</a> - 作者 <a href="https://github.com/HuaqingAI">@HuaqingAI</a> - 吉祥物</td>
  </tr>
  <tr>
    <th>安装</th>
    <td colspan="5"><code>npx awesome-codex-pets install sophon--huaqingai</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- sophon--huaqingai</code></td>
  </tr>
  <tr>
    <th>动作</th>
    <th>待机</th><th>挥手</th><th>工作</th><th>等待</th><th>审阅</th>
  </tr>
  <tr>
    <th>预览</th>
    <td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/sophon--huaqingai/idle.gif" alt="Sophon 待机" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/sophon--huaqingai/waving.gif" alt="Sophon 挥手" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/sophon--huaqingai/running.gif" alt="Sophon 工作" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/sophon--huaqingai/waiting.gif" alt="Sophon 等待" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/sophon--huaqingai/review.gif" alt="Sophon 审阅" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>名称</th>
    <td colspan="5"><a href="https://github.com/HuaqingAI/awesome-codex-pets/tree/main/pets/waterdrop-probe--huaqingai">Waterdrop Probe</a> - 作者 <a href="https://github.com/HuaqingAI">@HuaqingAI</a> - 吉祥物</td>
  </tr>
  <tr>
    <th>安装</th>
    <td colspan="5"><code>npx awesome-codex-pets install waterdrop-probe--huaqingai</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- waterdrop-probe--huaqingai</code></td>
  </tr>
  <tr>
    <th>动作</th>
    <th>待机</th><th>挥手</th><th>工作</th><th>等待</th><th>审阅</th>
  </tr>
  <tr>
    <th>预览</th>
    <td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/waterdrop-probe--huaqingai/idle.gif" alt="Waterdrop Probe 待机" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/waterdrop-probe--huaqingai/waving.gif" alt="Waterdrop Probe 挥手" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/waterdrop-probe--huaqingai/running.gif" alt="Waterdrop Probe 工作" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/waterdrop-probe--huaqingai/waiting.gif" alt="Waterdrop Probe 等待" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/waterdrop-probe--huaqingai/review.gif" alt="Waterdrop Probe 审阅" width="96" /></td>
  </tr>
</table>

### 动漫角色

<table>
  <tr>
    <th>名称</th>
    <td colspan="5"><a href="https://github.com/huaqingai/awesome-codex-pets/tree/main/pets/bocchi--lingxiaotian">Bocchi</a> - 作者 <a href="https://github.com/legeling">@Lingxiaotian</a> - 动漫角色</td>
  </tr>
  <tr>
    <th>安装</th>
    <td colspan="5"><code>npx awesome-codex-pets install bocchi--lingxiaotian</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- bocchi--lingxiaotian</code></td>
  </tr>
  <tr>
    <th>动作</th>
    <th>待机</th><th>挥手</th><th>工作</th><th>等待</th><th>审阅</th>
  </tr>
  <tr>
    <th>预览</th>
    <td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/bocchi--lingxiaotian/idle.gif" alt="Bocchi 待机" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/bocchi--lingxiaotian/waving.gif" alt="Bocchi 挥手" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/bocchi--lingxiaotian/running.gif" alt="Bocchi 工作" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/bocchi--lingxiaotian/waiting.gif" alt="Bocchi 等待" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/bocchi--lingxiaotian/review.gif" alt="Bocchi 审阅" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>名称</th>
    <td colspan="5"><a href="https://github.com/huaqingai/awesome-codex-pets/tree/main/pets/dnf-female-ammo--qunboo">女弹药Q</a> - 作者 <a href="https://github.com/QunBoo">@QunBoo</a> - 动漫角色</td>
  </tr>
  <tr>
    <th>安装</th>
    <td colspan="5"><code>npx awesome-codex-pets install dnf-female-ammo--qunboo</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- dnf-female-ammo--qunboo</code></td>
  </tr>
  <tr>
    <th>动作</th>
    <th>待机</th><th>挥手</th><th>工作</th><th>等待</th><th>审阅</th>
  </tr>
  <tr>
    <th>预览</th>
    <td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/dnf-female-ammo--qunboo/idle.gif" alt="女弹药Q 待机" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/dnf-female-ammo--qunboo/waving.gif" alt="女弹药Q 挥手" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/dnf-female-ammo--qunboo/running.gif" alt="女弹药Q 工作" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/dnf-female-ammo--qunboo/waiting.gif" alt="女弹药Q 等待" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/dnf-female-ammo--qunboo/review.gif" alt="女弹药Q 审阅" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>名称</th>
    <td colspan="5"><a href="https://github.com/huaqingai/awesome-codex-pets/tree/main/pets/firefly--lingxiaotian">Firefly</a> - 作者 <a href="https://github.com/legeling">@Lingxiaotian</a> - 动漫角色</td>
  </tr>
  <tr>
    <th>安装</th>
    <td colspan="5"><code>npx awesome-codex-pets install firefly--lingxiaotian</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- firefly--lingxiaotian</code></td>
  </tr>
  <tr>
    <th>动作</th>
    <th>待机</th><th>挥手</th><th>工作</th><th>等待</th><th>审阅</th>
  </tr>
  <tr>
    <th>预览</th>
    <td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/firefly--lingxiaotian/idle.gif" alt="Firefly 待机" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/firefly--lingxiaotian/waving.gif" alt="Firefly 挥手" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/firefly--lingxiaotian/running.gif" alt="Firefly 工作" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/firefly--lingxiaotian/waiting.gif" alt="Firefly 等待" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/firefly--lingxiaotian/review.gif" alt="Firefly 审阅" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>名称</th>
    <td colspan="5"><a href="https://github.com/huaqingai/awesome-codex-pets/tree/main/pets/frieren--lingxiaotian">Frieren</a> - 作者 <a href="https://github.com/legeling">@Lingxiaotian</a> - 动漫角色</td>
  </tr>
  <tr>
    <th>安装</th>
    <td colspan="5"><code>npx awesome-codex-pets install frieren--lingxiaotian</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- frieren--lingxiaotian</code></td>
  </tr>
  <tr>
    <th>动作</th>
    <th>待机</th><th>挥手</th><th>工作</th><th>等待</th><th>审阅</th>
  </tr>
  <tr>
    <th>预览</th>
    <td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/frieren--lingxiaotian/idle.gif" alt="Frieren 待机" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/frieren--lingxiaotian/waving.gif" alt="Frieren 挥手" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/frieren--lingxiaotian/running.gif" alt="Frieren 工作" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/frieren--lingxiaotian/waiting.gif" alt="Frieren 等待" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/frieren--lingxiaotian/review.gif" alt="Frieren 审阅" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>名称</th>
    <td colspan="5"><a href="https://github.com/huaqingai/awesome-codex-pets/tree/main/pets/mahiro--lingxiaotian">Mahiro</a> - 作者 <a href="https://github.com/legeling">@Lingxiaotian</a> - 动漫角色</td>
  </tr>
  <tr>
    <th>安装</th>
    <td colspan="5"><code>npx awesome-codex-pets install mahiro--lingxiaotian</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- mahiro--lingxiaotian</code></td>
  </tr>
  <tr>
    <th>动作</th>
    <th>待机</th><th>挥手</th><th>工作</th><th>等待</th><th>审阅</th>
  </tr>
  <tr>
    <th>预览</th>
    <td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/mahiro--lingxiaotian/idle.gif" alt="Mahiro 待机" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/mahiro--lingxiaotian/waving.gif" alt="Mahiro 挥手" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/mahiro--lingxiaotian/running.gif" alt="Mahiro 工作" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/mahiro--lingxiaotian/waiting.gif" alt="Mahiro 等待" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/mahiro--lingxiaotian/review.gif" alt="Mahiro 审阅" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>名称</th>
    <td colspan="5"><a href="https://github.com/huaqingai/awesome-codex-pets/tree/main/pets/mikoto--lingxiaotian">Mikoto</a> - 作者 <a href="https://github.com/legeling">@Lingxiaotian</a> - 动漫角色</td>
  </tr>
  <tr>
    <th>安装</th>
    <td colspan="5"><code>npx awesome-codex-pets install mikoto--lingxiaotian</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- mikoto--lingxiaotian</code></td>
  </tr>
  <tr>
    <th>动作</th>
    <th>待机</th><th>挥手</th><th>工作</th><th>等待</th><th>审阅</th>
  </tr>
  <tr>
    <th>预览</th>
    <td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/mikoto--lingxiaotian/idle.gif" alt="Mikoto 待机" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/mikoto--lingxiaotian/waving.gif" alt="Mikoto 挥手" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/mikoto--lingxiaotian/running.gif" alt="Mikoto 工作" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/mikoto--lingxiaotian/waiting.gif" alt="Mikoto 等待" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/mikoto--lingxiaotian/review.gif" alt="Mikoto 审阅" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>名称</th>
    <td colspan="5"><a href="https://github.com/huaqingai/awesome-codex-pets/tree/main/pets/miku--lingxiaotian">Miku</a> - 作者 <a href="https://github.com/legeling">@Lingxiaotian</a> - 动漫角色</td>
  </tr>
  <tr>
    <th>安装</th>
    <td colspan="5"><code>npx awesome-codex-pets install miku--lingxiaotian</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- miku--lingxiaotian</code></td>
  </tr>
  <tr>
    <th>动作</th>
    <th>待机</th><th>挥手</th><th>工作</th><th>等待</th><th>审阅</th>
  </tr>
  <tr>
    <th>预览</th>
    <td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/miku--lingxiaotian/idle.gif" alt="Miku 待机" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/miku--lingxiaotian/waving.gif" alt="Miku 挥手" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/miku--lingxiaotian/running.gif" alt="Miku 工作" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/miku--lingxiaotian/waiting.gif" alt="Miku 等待" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/miku--lingxiaotian/review.gif" alt="Miku 审阅" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>名称</th>
    <td colspan="5"><a href="https://github.com/huaqingai/awesome-codex-pets/tree/main/pets/paimon--lingxiaotian">Paimon</a> - 作者 <a href="https://github.com/legeling">@Lingxiaotian</a> - 动漫角色</td>
  </tr>
  <tr>
    <th>安装</th>
    <td colspan="5"><code>npx awesome-codex-pets install paimon--lingxiaotian</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- paimon--lingxiaotian</code></td>
  </tr>
  <tr>
    <th>动作</th>
    <th>待机</th><th>挥手</th><th>工作</th><th>等待</th><th>审阅</th>
  </tr>
  <tr>
    <th>预览</th>
    <td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/paimon--lingxiaotian/idle.gif" alt="Paimon 待机" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/paimon--lingxiaotian/waving.gif" alt="Paimon 挥手" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/paimon--lingxiaotian/running.gif" alt="Paimon 工作" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/paimon--lingxiaotian/waiting.gif" alt="Paimon 等待" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/paimon--lingxiaotian/review.gif" alt="Paimon 审阅" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>名称</th>
    <td colspan="5"><a href="https://github.com/huaqingai/awesome-codex-pets/tree/main/pets/reimu--lingxiaotian">Reimu</a> - 作者 <a href="https://github.com/legeling">@Lingxiaotian</a> - 动漫角色</td>
  </tr>
  <tr>
    <th>安装</th>
    <td colspan="5"><code>npx awesome-codex-pets install reimu--lingxiaotian</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- reimu--lingxiaotian</code></td>
  </tr>
  <tr>
    <th>动作</th>
    <th>待机</th><th>挥手</th><th>工作</th><th>等待</th><th>审阅</th>
  </tr>
  <tr>
    <th>预览</th>
    <td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/reimu--lingxiaotian/idle.gif" alt="Reimu 待机" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/reimu--lingxiaotian/waving.gif" alt="Reimu 挥手" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/reimu--lingxiaotian/running.gif" alt="Reimu 工作" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/reimu--lingxiaotian/waiting.gif" alt="Reimu 等待" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/reimu--lingxiaotian/review.gif" alt="Reimu 审阅" width="96" /></td>
  </tr>
</table>

### 动物

<table>
  <tr>
    <th>名称</th>
    <td colspan="5"><a href="https://github.com/huaqingai/awesome-codex-pets/tree/main/pets/becky--natewanggg">Becky</a> - 作者 <a href="https://github.com/NateWanggg">@NateWanggg</a> - 动物</td>
  </tr>
  <tr>
    <th>安装</th>
    <td colspan="5"><code>npx awesome-codex-pets install becky--natewanggg</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- becky--natewanggg</code></td>
  </tr>
  <tr>
    <th>动作</th>
    <th>待机</th><th>挥手</th><th>工作</th><th>等待</th><th>审阅</th>
  </tr>
  <tr>
    <th>预览</th>
    <td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/becky--natewanggg/idle.gif" alt="Becky 待机" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/becky--natewanggg/waving.gif" alt="Becky 挥手" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/becky--natewanggg/running.gif" alt="Becky 工作" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/becky--natewanggg/waiting.gif" alt="Becky 等待" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/becky--natewanggg/review.gif" alt="Becky 审阅" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>名称</th>
    <td colspan="5"><a href="https://github.com/huaqingai/awesome-codex-pets/tree/main/pets/fleta--natewanggg">Fleta</a> - 作者 <a href="https://github.com/NateWanggg">@NateWanggg</a> - 动物</td>
  </tr>
  <tr>
    <th>安装</th>
    <td colspan="5"><code>npx awesome-codex-pets install fleta--natewanggg</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- fleta--natewanggg</code></td>
  </tr>
  <tr>
    <th>动作</th>
    <th>待机</th><th>挥手</th><th>工作</th><th>等待</th><th>审阅</th>
  </tr>
  <tr>
    <th>预览</th>
    <td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/fleta--natewanggg/idle.gif" alt="Fleta 待机" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/fleta--natewanggg/waving.gif" alt="Fleta 挥手" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/fleta--natewanggg/running.gif" alt="Fleta 工作" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/fleta--natewanggg/waiting.gif" alt="Fleta 等待" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/fleta--natewanggg/review.gif" alt="Fleta 审阅" width="96" /></td>
  </tr>
</table>

<table>
  <tr>
    <th>名称</th>
    <td colspan="5"><a href="https://danieloleary.github.io/teddy-v31/">Teddy</a> - 作者 <a href="https://github.com/danieloleary">@Daniel O'Leary</a> - 动物</td>
  </tr>
  <tr>
    <th>安装</th>
    <td colspan="5"><code>npx awesome-codex-pets install teddy--danieloleary</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- teddy--danieloleary</code></td>
  </tr>
  <tr>
    <th>动作</th>
    <th>待机</th><th>挥手</th><th>工作</th><th>等待</th><th>审阅</th>
  </tr>
  <tr>
    <th>预览</th>
    <td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/teddy--danieloleary/idle.gif" alt="Teddy 待机" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/teddy--danieloleary/waving.gif" alt="Teddy 挥手" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/teddy--danieloleary/running.gif" alt="Teddy 工作" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/teddy--danieloleary/waiting.gif" alt="Teddy 等待" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/teddy--danieloleary/review.gif" alt="Teddy 审阅" width="96" /></td>
  </tr>
</table>

### 原创角色

<table>
  <tr>
    <th>名称</th>
    <td colspan="5"><a href="https://github.com/netizenXuan/night-neko-codex-pet">Night Neko</a> - 作者 <a href="https://github.com/netizenXuan">@netizenXuan</a> - 原创角色</td>
  </tr>
  <tr>
    <th>安装</th>
    <td colspan="5"><code>npx awesome-codex-pets install night-neko--netizenxuan</code><br/><code>curl -fsSL https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/scripts/install-pet.sh | bash -s -- night-neko--netizenxuan</code></td>
  </tr>
  <tr>
    <th>动作</th>
    <th>待机</th><th>挥手</th><th>工作</th><th>等待</th><th>审阅</th>
  </tr>
  <tr>
    <th>预览</th>
    <td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/night-neko--netizenxuan/idle.gif" alt="Night Neko 待机" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/night-neko--netizenxuan/waving.gif" alt="Night Neko 挥手" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/night-neko--netizenxuan/running.gif" alt="Night Neko 工作" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/night-neko--netizenxuan/waiting.gif" alt="Night Neko 等待" width="96" /></td><td><img src="https://raw.githubusercontent.com/huaqingai/awesome-codex-pets/main/assets/previews/night-neko--netizenxuan/review.gif" alt="Night Neko 审阅" width="96" /></td>
  </tr>
</table>
<!-- PET_CATALOG_END -->

## 维护流程

宠物包目录结构：

```text
pets/<pet-id>/
  submission.json
  pet.json
  spritesheet.webp
```

新增贡献推荐使用本地工作流。`init` 会把未完成元数据写入
`.codex-pets/drafts/`，避免半成品破坏校验。`import` 只在 `pet.json` 和
`spritesheet.webp` 可用后创建正式 `pets/<pet-id>/` 包。`finalize` 会同步生成
文件：

```bash
npm install
npx awesome-codex-pets add-pet init <pet-name> --author <author-or-profile>
npx awesome-codex-pets add-pet import --draft <pet-id>
npx awesome-codex-pets add-pet finalize <pet-id>
```

也可以手动维护：

```bash
npm run catalog:sync
npm run previews
npm run readme
npm run validate
```

## 发布流程

GitHub Actions 会在推送版本 tag 时发布 npm 包。需要在仓库 secret 中配置
`NPM_TOKEN`，使用可发布 `awesome-codex-pets` 的 npm automation token。

首次发布：

```bash
git push origin main
git tag v0.1.0
git push origin v0.1.0
```

后续发布：

```bash
npm version patch
git push origin main --follow-tags
```

发布 workflow 要求 tag 与 `package.json` 版本完全匹配，例如 `v0.1.0`。
它会运行 `npm ci`、`npm run build`，检查生成文件是否已提交，使用 provenance
发布到 npm，并创建 GitHub Release。宠物 spritesheet 和预览 GIF 不打进 npm
包；CLI 会使用 `catalog.rawBaseUrl` 在安装时从 GitHub 按需下载选中的宠物资源。

预览生成器遵循 Codex atlas 约定：`1536x1872`、`8x9` 网格、`192x208`
单元格、透明背景。它会为每个状态写入一个 GIF 到
`assets/previews/<pet-id>/<state>.gif`。

更多细节见 [docs/PET_FORMAT.md](docs/PET_FORMAT.md)、
[docs/ADDING_PETS.md](docs/ADDING_PETS.md) 和 [ROADMAP.md](ROADMAP.md)。
