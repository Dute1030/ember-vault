# 余烬地牢 · Ember Vault

中文像素风卡牌 Roguelike。选择职业、构筑牌组、规划路线，挑战三位地牢领主。游戏完全在浏览器运行，无需数据库或 API Key。

[开发日志](CHANGELOG.md) · [在线游玩](https://candid-panda-4e7ff3.netlify.app) · [最新机制说明](docs/mechanics-update.md) · [难度与确认流程](docs/confirmation-difficulty.md)

> 在线站点单独部署，版本取决于最近一次 Netlify 更新；本仓库包含最新源码。

## 游戏内容

- **3 个职业**：铁卫的护甲与盾击、影刃的连击与中毒、秘术师的灵力与爆发。
- **60 张卡牌，每张两条升级路线**：强化数值，或选择减费、穿甲、群体效果、保留护甲等专精机制；升级前后对比，确认后生效。
- **15 层随机路线与 3 位 Boss**：破盾打断、祷告召唤、半血后限制连出四张牌。
- **9 种随机事件**：随机升级、付费专精、复制卡牌、生命上限换治疗等；确认后显示实际结果。
- **商店刷新与删牌**：刷新 20 金币起、每次加 10；删牌每店一次，整局 55 金币起、每次加 20。
- **局外冒险记录**：按职业和难度统计通关、胜率、最快用时与最近十局，保存在当前浏览器。
- **8 件遗物**：主界面显示已获得遗物，点击查看效果，自动生效。
- **像素角色与战斗演出**：攻击、受击、护甲、中毒和法术反馈，伤害数字来自实际结算。
- **独立 BGM 与音效开关**，原创合成循环曲，无外部音频请求。
- **7 步实战教程**，不影响正式冒险存档，可随时重温。
- **关键选择需要确认**：事件、路线、奖励、购买、删牌与休息，避免误触。

## 如何游玩

1. 新手可先完成教程，再选择职业和难度开始冒险。
2. 单体牌先选牌，再点击敌人；也可把牌拖向敌人松开施放。群体牌和自身增益牌直接点击使用。
3. 瞄准时显示预计伤害与状态变化。再次点击选中牌、Esc、右键或拖到无效区域可取消，不消耗能量。
4. 每回合恢复 3 能量并抽 5 张牌。数字键 1–9 选牌，空格结束回合。
5. 观察敌人意图，兼顾防御与击杀。普通护甲在下一回合开始时清零，固守保留一次剩余护甲；铁卫随后重新获得 2 护甲。
6. 战后选牌或跳过；营地休息或升级；商店购买卡牌、遗物或移除卡牌。生命归零本局结束。

进度只保存在当前浏览器的 localStorage。不同域名、浏览器与设备之间不共享存档。首次点击或键盘交互后才会播放音乐与音效。

## 本地运行

推荐 **Node.js 22.18+ 或 24+**（测试直接运行 TypeScript），使用 npm：

```bash
git clone https://github.com/Dute1030/ember-vault.git
cd ember-vault
npm ci
npm run dev:static
```

打开终端显示的本地地址。纯前端开发入口为 `static/main.tsx`，与 `app/page.tsx` 共用全部游戏规则和 UI。

## 构建与部署

```bash
npm run build:static
```

将 `dist-static/` **目录内的内容**上传至 Netlify、Cloudflare Pages 或静态服务器。通过 HTTP/HTTPS 打开，不要双击 HTML。

在 Netlify 连接此仓库时：构建命令使用 `npm run build:static`，发布目录使用 `dist-static`。部署完成后平台提供访问域名，也可配置自定义域名。

项目也保留 Vinext 开发与 Worker 构建入口：`npm run dev`、`npm run build`；单纯游玩或静态托管优先使用 `dev:static` 和 `build:static`。

## 检查与模拟

```bash
node --test tests/*.test.ts
npx tsc --noEmit
node tests/simulate.ts
```

当前包含 78 项测试。默认模拟每职业每难度 100 局，可调整：

```bash
SIM_RUNS=300 SIM_START=3000 node tests/simulate.ts
SIM_RUNS=100 SIM_START=4000 SIM_TACTIC=1 node tests/simulate.ts
```

本次扩展后固定策略模拟 900 局，标准模式 61 / 450 通关（13.6%），苦难模式 15 / 450（3.3%），均正常结束。旧版 19.4% 属于 36 张卡牌时期的数据。模拟不代表真人胜率保证，详见 [本日开发日志](docs/development-log-2026-09-11.md)。

## 项目结构

| 路径 | 内容 |
| --- | --- |
| `app/page.tsx` / `app/globals.css` | 游戏界面、交互和样式 |
| `lib/game.ts` | 职业、卡牌、遗物、敌人与状态结算 |
| `lib/combat-feedback.ts` / `lib/battle-audio.ts` | 战斗演出和合成音效 |
| `lib/choice-confirmation.ts` | 选择确认的效果与代价预览 |
| `components/` | 像素角色、升级面板、实战教程和 UI 组件 |
| `public/art/` / `public/audio/` | 游戏美术和音乐 |
| `scripts/generate_bgm.py` | 原创 BGM 生成脚本 |
| `tests/` | 回归测试与完整冒险模拟 |
| `docs/` | 机制和数值调整记录 |
| `static/` / `vite.static.config.ts` | 纯静态站点入口与打包配置 |

## 素材与技术

React 19、TypeScript、Vite/Vinext、Tailwind CSS、Base UI 与 Lucide 图标。背景及像素角色图集为本项目生成的素材；BGM 由 `scripts/generate_bgm.py` 合成，为约 43.64 秒的 D 小调循环曲，无外部采样。战斗音效使用 Web Audio 即时合成。

历史数值评审见 `docs/balance-review.md`；最新规则以 `docs/confirmation-difficulty.md` 和当前代码为准。旧存档保留已经生成的敌人和角色生命，新开一局可体验完整最新数值。


最新内容扩展：新增 24 张卡牌（各职业 6 张、通用 6 张），全部拥有强化与专精两条升级路线；随机事件扩展到 9 种。详见 [卡牌与奇遇扩展](docs/content-expansion.md)。旧版本的胜率模拟结果不代表扩展卡池后的难度。
