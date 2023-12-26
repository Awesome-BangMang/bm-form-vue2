import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue2';
import path from 'path-browserify'
import WindiCSS from 'vite-plugin-windicss'
import vueJsx from '@vitejs/plugin-vue2-jsx'

export default defineConfig({
  plugins: [
    vue(), WindiCSS(), vueJsx({
      compositionAPI: true,
    })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'packages'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  build: {
    target: 'esnext',
    outDir: 'bm-form-vue2',
    minify: true,
    lib: {
      entry: 'src/index.js',
      name: 'bm-form-vue2',
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 为全局变量提供一个名称，在浏览器中通过 window 访问
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
