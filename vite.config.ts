import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'; // Reactプラグインをインポート
import path from 'path';

export default defineConfig(({ mode }) => {
    // process.cwd() を使うのが一般的です
    const env = loadEnv(mode, process.cwd(), ''); 

    return {
      plugins: [react()], // Reactプラグインを追加
      base: '/polycanva.complex-todo/', // GitHub Pages用のパス設定を追加

      define: {
        // この部分はご提示いただいた通りです
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});