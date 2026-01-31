import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const envVars = {
  local: {
    __API_BASE_URL__: JSON.stringify('http://localhost:8000'),
    __LOGGING_LEVEL__: JSON.stringify('local'),
  },
  production: {
    __API_BASE_URL__: JSON.stringify(''),
    __LOGGING_LEVEL__: JSON.stringify('sentry'),
  },
}

export default defineConfig(({ mode }) => {
  const env = mode === 'production' ? 'production' : 'local'

  return {
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
      }),
    ],
    define: envVars[env],
    resolve: {
      alias: {
        sharedComponents: path.resolve(__dirname, 'src/sharedComponents/'),
        sharedTypes: path.resolve(__dirname, 'src/sharedTypes/index.ts'),
        theme: path.resolve(__dirname, 'src/theme.tsx'),
        utilities: path.resolve(__dirname, 'src/utilities.ts'),
        context: path.resolve(__dirname, 'src/Context.tsx'),
      },
    },
    server: {
      port: 3000,
    },
    build: {
      outDir: 'build',
    },
  }
})
