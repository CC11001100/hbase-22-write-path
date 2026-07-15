import type { HeaderProps } from '../types'
import styles from './Header.module.css'

export function Header({
  title,
  topicNumber,
  category,
  repoUrl,
  backUrl,
  backText,
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.titleGroup}>
        {backUrl && (
          <a className={styles.backLink} href={backUrl}>
            ← {backText ?? '返回'}
          </a>
        )}
        <span className={styles.badge}>#{String(topicNumber).padStart(2, '0')}</span>
        <div>
          <div className={styles.title}>{title}</div>
          <div className={styles.category}>{category}</div>
        </div>
      </div>
      <div className={styles.actions}>
        <a
          className={styles.link}
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub →
        </a>
      </div>
    </header>
  )
}
