/*
 * @Author: YinZihao 2764053835@qq.com
 * @Date: 2026-04-03 15:03:50
 * @LastEditors: YinZihao 2764053835@qq.com
 * @LastEditTime: 2026-04-10 06:39:32
 * @FilePath: \Student-Management-System-master\code\frontend\vite.config.js
 * @Description: 
 * 
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
