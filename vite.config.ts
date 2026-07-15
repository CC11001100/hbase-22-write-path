import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 模板占位符：生成仓库时将 {{REPO_NAME}} 替换为实际仓库名（如 hbase-09-memstore）
// base 必须与仓库名一致，否则 GitHub Pages 子路径资源 404
export default defineConfig({
  plugins: [react()],
  base: '/{{REPO_NAME}}/',
  server: {
    port: 54300,
  },
})
