/**
 * 通用输入校验工具
 * 各知识点可覆盖 generateSteps 与 validateInput 自定义校验逻辑
 */
import type { ValidationResult, InputData } from '../types'

export function validateInput(_data: InputData): ValidationResult {
  // 模板默认实现：永远通过。各知识点在 algorithms/ 中覆盖。
  return { isValid: true }
}
