import type { ThemeConfig } from 'antd'

// HBase Hub 品牌主题：绿色主调，对齐原 global.css 的 --color-brand #0a7c5a
export const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: '#0a7c5a',
    colorBgLayout: '#f5f7fa',
    borderRadius: 8,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      headerHeight: 64,
      headerPadding: '0 24px',
      bodyBg: '#f5f7fa',
    },
    Card: {
      borderRadiusLG: 10,
    },
  },
}

// Canvas 元素状态色：固定 hex（不走 CSS var，避免 SVG attribute var() 失效）
// 文字统一深色 #1a202c，在所有状态色背景上均可读
export const STATE_COLORS: Record<string, string> = {
  idle: '#e2e8f0',
  active: '#f6ad55',
  writing: '#63b3ed',
  flushing: '#b794f4',
  done: '#68d391',
  deleted: '#fc8181',
  error: '#fc8181',
}

export const ELEMENT_TEXT_COLOR = '#1a202c'
export const ELEMENT_BORDER_COLOR = '#cbd5e0'
export const CONNECTION_COLOR = '#718096'
