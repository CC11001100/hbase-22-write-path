# HBase 动画演示模板 (hbase-template)

> 本仓库是 HBase 动画演示矩阵的**脚手架模板**，用于批量生成各知识点演示仓库。

## 技术栈

- Vite 7 + React 19 + TypeScript 5.9
- D3 7（可视化，本模板实际用纯 SVG，各仓库可按需引入 D3）
- prismjs（多语言代码高亮）
- IndexedDB（播放偏好持久化）
- Vitest + fast-check（单元测试 + 属性测试）
- GitHub Actions（自动部署到 GitHub Pages）

## 目录结构

```
src/
├── algorithms/          # 算法步骤生成器（各知识点在此覆盖）
│   ├── stepGenerator.ts
│   └── index.ts
├── components/          # 通用组件
│   ├── Canvas.tsx       # SVG 画布，渲染 elements/connections/annotations
│   ├── CodeDebugger.tsx # 代码面板 + 变量面板
│   ├── ControlPanel.tsx # 步进/播放/速率控制
│   ├── DataInput.tsx    # 演示场景选择
│   ├── Header.tsx
│   └── FloatingBall.tsx # 返回导航站悬浮球
├── hooks/
│   ├── useAlgorithmPlayer.ts    # 播放控制 hook
│   └── algorithmPlayerLogic.ts  # 纯函数逻辑（可测）
├── types/index.ts       # 通用 Step 抽象
├── utils/               # indexedDB / 语法高亮 / 随机数 / 校验
├── styles/global.css
├── App.tsx
└── main.tsx
```

## 通用 Step 抽象

所有知识点共享同一套 `Step` 类型，差异体现在 `algorithms/stepGenerator.ts` 的实现：

- `elements: VisualElement[]` — 画布元素（Region/Cell/Block/节点，通用）
- `connections: Connection[]` — 元素间连接（箭头/包含/链接）
- `variables: VariableState[]` — 变量面板
- `annotations: Annotation[]` — 浮动注解
- `calculation` / `actionLabel` / `statusText` / `algorithmHint`

## 用此模板生成新仓库

1. 在本仓库页面点 **"Use this template → Create a new repository"**
2. 仓库名按规范：`hbase-NN-slug`（如 `hbase-09-memstore`）
3. 全局替换占位符：
   - `{{REPO_NAME}}` → 实际仓库名（影响 `vite.config.ts` 的 base 路径）
   - `{{TOPIC_TITLE}}` → 知识点标题
   - `{{TOPIC_NUMBER}}` → 编号数字
   - `{{TOPIC_CATEGORY}}` → 分类中文名
4. 在 `src/algorithms/stepGenerator.ts` 实现具体知识点逻辑
5. `npm install && npm run dev` 本地预览（端口 54300）
6. push 到 main，GitHub Actions 自动部署到
   `https://hbase-hub.github.io/hbase-NN-slug/`
7. 在 [hbase-index](https://github.com/hbase-hub/hbase-index) 追加 Topic 元数据

## 本地开发

```bash
npm install
npm run dev      # 启动开发服务器
npm test         # 运行测试
npm run build    # 构建生产包到 dist/
```

## 键盘快捷键

- `←` / `→` 上一步 / 下一步
- `Space` 播放 / 暂停
- `R` 重置

## License

MIT
