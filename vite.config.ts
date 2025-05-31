import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// C:\\Host\\Polosys\\Ui
export default defineConfig({
  plugins: [react()],
  server: {
    host: '192.168.20.208',
    port: 5173, 
  },
  build: {
    // outDir: 'build',
    outDir: 'C:\\Host\\Polosys\\Ui',
    chunkSizeWarningLimit: 50000,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }
        warn(warning);
      },
    },
  },
})
