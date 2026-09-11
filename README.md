# 余烬地牢 · Ember Vault

中文像素风卡牌 Roguelike，完全在浏览器运行，无需后端或 API Key。

[在线游玩](https://candid-panda-4e7ff3.netlify.app)

> 仓库已建立，源码正在上传；完整代码上传后即可按下方命令运行。在线版本取决于最近一次 Netlify 部署。

## 游戏内容

- 三个职业：铁卫、影刃、秘术师，分别围绕护甲、连击中毒、灵力爆发展开。
- 36 张卡牌，每张可选择强化或专精路线；支持减费、穿甲、群体效果、护甲保留等机制。
- 15 层随机相邻路线，包含战斗、精英、营地、商店和事件。
- 三位 Boss：铁颚破盾打断、无光主教祷告召唤、灰烬之王半血后的第四张牌反击。
- 8 件自动生效的遗物，主界面展示并支持点击查看效果。
- 像素角色、攻击与受击特效、伤害飘字、合成音效和原创循环 BGM。
- 独立实战教程，不影响正式存档。事件、奖励、路线、购物、删牌和休息都须确认。

## 操作

单体牌先选牌再点击敌人，或拖到敌人身上松开施放；群体牌与自身增益牌可直接点击。瞄准显示预计伤害和状态变化。Esc、右键、再次点击选中牌或拖到无效区域可取消，不扣能量。

数字键 1–9 选牌，空格结束回合。每回合抽 5 张牌、恢复 3 能量。普通护甲下回合开始时清零，固守保留一次剩余护甲，铁卫随后重新获得 2 护甲。

存档保存在当前浏览器 localStorage，不同域名与设备之间不共享。首次交互后启动音频，BGM 和音效分别控制。

## 本地运行

推荐 Node.js 22.18+ 或 24+。

```bash
git clone https://github.com/Dute1030/ember-vault.git
cd ember-vault
npm ci
npm run dev:static
```

## 部署

```bash
npm run build:static
```

将 `dist-static` 目录内容上传到 Netlify、Cloudflare Pages 或静态服务器，通过 HTTP/HTTPS 访问。Netlify 连接仓库时使用构建命令 `npm run build:static`，发布目录 `dist-static`。

## 验证

```bash
node --test tests/*.test.ts
npx tsc --noEmit
node tests/simulate.ts
SIM_RUNS=300 SIM_START=3000 node tests/simulate.ts
SIM_RUNS=100 SIM_START=4000 SIM_TACTIC=1 node tests/simulate.ts
```

54 项测试覆盖卡牌、Boss、护甲、存档、音效与选择确认。普通模式最终 1500 局模拟通关率 19.4%；独立验证 900 局为 18.3%，专精补测 300 局为 19.7%。模拟使用固定策略，不代表真人胜率保证。

## 源码结构

- `app/`：游戏界面和样式。
- `lib/game.ts`：卡牌、职业、遗物、敌人和战斗结算。
- `lib/combat-feedback.ts`、`lib/battle-audio.ts`：演出与音效。
- `lib/choice-confirmation.ts`：关键选择的收益和代价预览。
- `components/`：像素角色、升级面板、教程与 UI 组件。
- `public/art/`、`public/audio/`：美术与音乐资源。
- `scripts/generate_bgm.py`：原创 BGM 生成脚本。
- `static/`、`vite.static.config.ts`：纯前端入口和打包配置。
- `tests/`、`docs/`：测试、整局模拟和机制说明。

## 技术与素材

React 19、TypeScript、Vite/Vinext、Tailwind CSS、Base UI 和 Lucide。背景与像素图集为本项目生成素材；BGM 是约 43.64 秒的 D 小调合成循环曲，无外部采样；战斗音效由 Web Audio 即时合成。
