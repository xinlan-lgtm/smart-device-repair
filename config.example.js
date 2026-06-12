/**
 * config.example.js — 配置文件示例
 *
 * 使用说明：
 * 1. 将此文件复制一份，重命名为 config.js（或直接在 constants.js 中修改）
 * 2. 前往 https://platform.deepseek.com 注册并获取你的 DeepSeek API Key
 * 3. 将下面的 'your-deepseek-api-key-here' 替换为你的真实 API Key
 *
 * 注意：config.js 包含敏感信息，已在 .gitignore 中忽略，请勿提交到版本库。
 */

const DEEPSEEK_CONFIG = {
  BASE_URL: 'https://api.deepseek.com',
  MODEL: 'deepseek-chat',
  API_KEY: 'your-deepseek-api-key-here'  // ← 替换为你的真实 API Key
}

module.exports = { DEEPSEEK_CONFIG }
