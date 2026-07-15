/**
 * HBase 动画演示通用类型系统
 *
 * 本文件定义所有演示仓库共享的通用 Step 抽象。
 * 各知识点的差异通过 algorithms/ 下的 generateSteps 实现体现，
 * 而非修改此类型文件。
 */

// ============ 通用数据结构 ============

/** 变量状态：用于变量面板展示当前各变量的值 */
export interface VariableState {
  name: string
  value: string
  /** 关联的代码行号（用于高亮） */
  line: number
  /** 变量类型标注，如 Map / List / number */
  type?: string
  /** 高亮颜色 */
  highlightColor?: string
}

/** 通用元素：画布上任意可视对象（Region、Cell、Block、节点等） */
export interface VisualElement {
  /** 全局唯一 id，用于跨步骤追踪同一对象 */
  id: string
  /** 元素类型，由各知识点自定义，如 'region' | 'cell' | 'block' | 'node' */
  type: string
  /** 主标签，显示在元素中央 */
  label: string
  /** 副标签，显示在元素角落 */
  subLabel?: string
  /** 坐标 */
  x: number
  y: number
  width: number
  height: number
  /** 状态：用于着色，如 'idle' | 'active' | 'writing' | 'flushing' | 'deleted' */
  state?: string
  /** 高亮颜色覆盖 */
  color?: string
  /** 关联的额外数据 */
  data?: Record<string, string | number | boolean>
}

/** 元素间连接：箭头、包含关系、数据流向 */
export interface Connection {
  id: string
  fromId: string
  toId: string
  /** 连接类型：'arrow' | 'contain' | 'link' */
  kind?: 'arrow' | 'contain' | 'link'
  label?: string
  color?: string
  /** 曲线控制点偏移 */
  curve?: { dx: number; dy: number }
}

/** 浮动注解：画布上的文字提示框 */
export interface Annotation {
  x: number
  y: number
  text: string
  /** 标注指向的元素 id（可选，用于画引导线） */
  targetId?: string
  color?: string
}

/** 计算展示：如 complement = target - nums[i] */
export interface CalculationDisplay {
  expression: string
  result: string
  x: number
  y: number
}

/** 代码块：用于代码面板展示当前执行行 */
export interface CodeBlock {
  /** 编程语言 */
  language: CodeLanguage
  /** 代码源码 */
  code: string
}

/** 支持的编程语言 */
export type CodeLanguage = 'java' | 'python' | 'golang' | 'javascript' | 'shell'

/** 单个算法步骤：一帧动画的完整状态 */
export interface Step {
  /** 步骤序号 */
  index: number
  /** 步骤描述，显示在状态栏 */
  description: string
  /** 当前高亮的代码行号（1-based） */
  currentLine: number
  /** 当前各变量状态 */
  variables: VariableState[]
  /** 画布元素 */
  elements: VisualElement[]
  /** 元素间连接 */
  connections: Connection[]
  /** 浮动注解 */
  annotations: Annotation[]
  /** 计算展示 */
  calculation?: CalculationDisplay
  /** 状态栏文本 */
  statusText?: string
  /** 动作标签，如 "PUT" / "FLUSH" / "SPLIT" */
  actionLabel?: string
  /** 算法提示 */
  algorithmHint?: string
}

// ============ 组件 Props ============

export interface HeaderProps {
  title: string
  topicNumber: number
  category: string
  repoUrl: string
  backUrl?: string
  backText?: string
}

export interface ControlPanelProps {
  currentStep: number
  totalSteps: number
  isPlaying: boolean
  playbackRate: PlaybackRate
  onPrev: () => void
  onNext: () => void
  onPlay: () => void
  onPause: () => void
  onReset: () => void
  onSeek: (step: number) => void
  onPlaybackRateChange: (rate: PlaybackRate) => void
}

export interface CanvasProps {
  step: Step
}

export interface CodeDebuggerProps {
  language: CodeLanguage
  onLanguageChange: (lang: CodeLanguage) => void
  currentLine: number
  variables: VariableState[]
}

/** 播放速率 */
export type PlaybackRate = 0.25 | 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2 | 3

/** 输入数据：各知识点自定义，模板提供空接口 */
export interface InputData {
  [key: string]: string | number | boolean | Array<string | number>
}

/** 预设数据 */
export interface PresetData {
  label: string
  data: InputData
}

/** 验证结果 */
export interface ValidationResult {
  isValid: boolean
  error?: string
}
