import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))
const src = fileURLToPath(new URL('./app/javascript/src', import.meta.url))

// Bare imports such as `import { routes } from 'routes'` resolve into src/.
// Keep this list in sync with jsconfig.json (used by editors).
const SOURCE_ALIASES = [
  'apis',
  'common',
  'components',
  'constants',
  'hooks',
  'translations',
  'utils',
  'routes',
]

export default defineConfig(({ mode }) => {
  // Load all variables (not only VITE_*) so the dev proxy target stays out of browser code.
  const env = loadEnv(mode, projectRoot, '')

  return {
    root: 'app/javascript',
    envDir: projectRoot,
    plugins: [react()],
    resolve: {
      alias: Object.fromEntries(
        SOURCE_ALIASES.map((name) => [name, `${src}/${name}`]),
      ),
    },
    server: {
      port: 5173,
      // Same-origin development: the browser calls /api/..., Vite forwards it to Rails.
      proxy: {
        '/api': {
          target: env.DEV_API_PROXY_TARGET || 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: `${projectRoot}/dist`,
      emptyOutDir: true,
    },
    test: {
      environment: 'jsdom',
      setupFiles: [`${src}/test/setup.js`],
      restoreMocks: true,
    },
  }
})
