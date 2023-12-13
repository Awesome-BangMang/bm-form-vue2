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
  }
})
