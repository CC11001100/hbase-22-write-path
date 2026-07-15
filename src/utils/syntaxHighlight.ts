/**
 * 语法高亮工具：基于 prismjs
 * 改造自 leetcode-visualizer，支持多语言切换
 */
import Prism from 'prismjs'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-bash'
import type { CodeLanguage } from '../types'

const PRISM_LANGUAGE_MAP: Record<CodeLanguage, string> = {
  java: 'java',
  python: 'python',
  golang: 'go',
  javascript: 'javascript',
  shell: 'bash',
}

export function highlightCode(code: string, language: CodeLanguage): string {
  const grammar = Prism.languages[PRISM_LANGUAGE_MAP[language]]
  if (!grammar) return escapeHtml(code)
  return Prism.highlight(code, grammar, PRISM_LANGUAGE_MAP[language])
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/** 将代码按行拆分，返回带行号的数组，供 CodeLine 渲染 */
export function splitCodeLines(code: string): string[] {
  return code.split('\n')
}
