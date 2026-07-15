import { useState } from 'react'
import type { CodeDebuggerProps, CodeLanguage } from '../types'
import { highlightCode, splitCodeLines } from '../utils/syntaxHighlight'
import { TEMPLATE_CODE } from '../algorithms/stepGenerator'
import styles from './CodeDebugger.module.css'

const LANGUAGES: CodeLanguage[] = ['java', 'python', 'golang', 'javascript', 'shell']

const LANG_LABEL: Record<CodeLanguage, string> = {
  java: 'Java',
  python: 'Python',
  golang: 'Go',
  javascript: 'JS',
  shell: 'Shell',
}

export function CodeDebugger({
  language,
  onLanguageChange,
  currentLine,
  variables,
}: CodeDebuggerProps) {
  const [code] = useState(TEMPLATE_CODE)
  const lines = splitCodeLines(code)
  const highlighted = lines.map((line) => highlightCode(line || ' ', language))

  return (
    <div className={styles.panel}>
      <div className={styles.langTabs}>
        {LANGUAGES.map((lang) => (
          <button
            key={lang}
            className={`${styles.langTab} ${language === lang ? styles.langTabActive : ''}`}
            onClick={() => onLanguageChange(lang)}
          >
            {LANG_LABEL[lang]}
          </button>
        ))}
      </div>
      <pre className={styles.codeContainer}>
        {highlighted.map((html, i) => {
          const lineNo = i + 1
          const isActive = lineNo === currentLine
          return (
            <div
              key={i}
              className={`${styles.codeLine} ${isActive ? styles.lineActive : ''}`}
            >
              <span className={styles.lineNumber}>{lineNo}</span>
              <span
                className={styles.codeContent}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          )
        })}
      </pre>
      <div className={styles.variables}>
        <div className={styles.variablesTitle}>变量状态</div>
        {variables.length === 0 ? (
          <div className={styles.empty}>—</div>
        ) : (
          <div className={styles.varList}>
            {variables.map((v, i) => (
              <div key={i} className={styles.varItem}>
                <span className={styles.varName}>{v.name}</span>
                <span className={styles.varValue}>= {v.value}</span>
                {v.type && <span className={styles.varType}>({v.type})</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
