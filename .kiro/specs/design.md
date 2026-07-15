# 设计：写路径全流程

## 架构

复用 hbase-template 的通用 Step 抽象：

- `algorithms/stepGenerator.ts`：生成该知识点所有步骤的 `Step[]`
- `components/Canvas.tsx`：渲染 `elements` / `connections` / `annotations`
- `hooks/useAlgorithmPlayer.ts`：播放控制（无需改动）

## 关键状态

（在此描述该知识点的核心数据结构与状态流转）
