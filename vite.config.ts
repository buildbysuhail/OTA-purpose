import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Read package.json version
const packageJson = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))

// https://vitejs.dev/config/
// C:\\Host\\Polosys\\Ui
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  const isDev = mode === 'development'

  const csp = isDev
    ? "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; img-src 'self' data: blob: https://res.cloudinary.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https: http: ws: wss:; frame-ancestors 'self';"
    : "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; img-src 'self' data: blob: https://res.cloudinary.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https: http: ws: wss:; frame-ancestors 'self';"

  return {
    base: "./",
    plugins: [
      react(),
      {
        name: 'html-csp',
        transformIndexHtml(html) {
          if (html.includes('Content-Security-Policy')) {
            return html
          }
          const meta = `<meta http-equiv="Content-Security-Policy" content="${csp}">`
          return html.replace('</head>', `  ${meta}\n  </head>`)
        }
      }
    ],
    define: {
      __APP_VERSION__: JSON.stringify(packageJson.version),
      // Storage fetch token from .env file or environment variable (GitHub secret)
      __STORAGE_FETCH_TOKEN__: JSON.stringify(env.VITE_STORAGE_FETCH_TOKEN || env.STORAGE_FETCH_TOKEN || '')
    },
    server: {
    host: '192.168.20.208',
    // host: true,  
    port: 5173, 
    //  allowedHosts: 'all',
    allowedHosts: [
      // 'replacing-eagles-till-reservation.trycloudflare.com',
      // 'camcorders-janet-flight-joins.trycloudflare.com',
    ],
  },
  build: {
    // outDir: 'C:\\inetpub\\wwwroot',
    // outDir: 'C:\\Host\\Polosys\\PolosysERP.UI',
    //  outDir: 'build',
     outDir: 'dist',
    //  sourcemap: false,
    //  minify: "esbuild",
    //  target: "es2018",
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
  }
})
