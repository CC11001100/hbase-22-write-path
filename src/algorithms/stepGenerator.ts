/**
 * 示例算法步骤生成器
 *
 * 这是模板自带的演示用实现，展示如何用通用 Step 抽象生成动画步骤。
 * 生成仓库时，在各知识点对应的 src/algorithms/stepGenerator.ts 中
 * 覆盖 generateSteps，实现具体知识点逻辑。
 */
import type { Step, VisualElement, VariableState } from '../types'

/** 模板示例代码 */
export const TEMPLATE_CODE = `// HBase 知识点演示代码模板
// 生成仓库后，在此替换为具体知识点的伪代码
public void demonstrate() {
    initialize();
    for (int i = 0; i < n; i++) {
        process(element[i]);
    }
    finalize();
}`

export function generateSteps(): Step[] {
  const steps: Step[] = []
  let stepIndex = 0

  const elements: VisualElement[] = [
    { id: 'el-0', type: 'box', label: '步骤 A', subLabel: 'i=0', x: 100, y: 100, width: 120, height: 60, state: 'idle' },
    { id: 'el-1', type: 'box', label: '步骤 B', subLabel: 'i=1', x: 280, y: 100, width: 120, height: 60, state: 'idle' },
    { id: 'el-2', type: 'box', label: '步骤 C', subLabel: 'i=2', x: 460, y: 100, width: 120, height: 60, state: 'idle' },
  ]

  const baseVars: VariableState[] = [
    { name: 'n', value: '3', line: 3 },
    { name: 'i', value: '0', line: 5 },
  ]

  // 步骤 0：初始化
  steps.push({
    index: stepIndex++,
    description: '初始化：准备处理 3 个元素',
    currentLine: 3,
    variables: [...baseVars],
    elements: elements.map((e) => ({ ...e })),
    connections: [],
    annotations: [{ x: 200, y: 200, text: '准备就绪' }],
    statusText: '初始化',
    actionLabel: 'INIT',
  })

  // 逐个处理
  for (let i = 0; i < 3; i++) {
    const activeElements = elements.map((e, idx) => ({
      ...e,
      state: idx === i ? 'active' : idx < i ? 'done' : 'idle',
    }))
    steps.push({
      index: stepIndex++,
      description: `处理元素 ${i}：执行 process()`,
      currentLine: 6,
      variables: [
        { name: 'n', value: '3', line: 3 },
        { name: 'i', value: String(i), line: 5 },
      ],
      elements: activeElements,
      connections: [
        {
          id: `flow-${i}`,
          fromId: `el-${i}`,
          toId: `el-${Math.min(i + 1, 2)}`,
          kind: 'arrow',
          label: 'next',
        },
      ],
      annotations: [{ x: 200, y: 200, text: `处理中：元素 ${i}`, targetId: `el-${i}` }],
      statusText: `处理元素 ${i}`,
      actionLabel: 'PROCESS',
    })
  }

  // 结束
  steps.push({
    index: stepIndex++,
    description: '处理完成：调用 finalize()',
    currentLine: 8,
    variables: [
      { name: 'n', value: '3', line: 3 },
      { name: 'i', value: '3', line: 5 },
    ],
    elements: elements.map((e) => ({ ...e, state: 'done' })),
    connections: [],
    annotations: [{ x: 200, y: 200, text: '全部完成 ✓' }],
    statusText: '完成',
    actionLabel: 'DONE',
  })

  return steps
}
