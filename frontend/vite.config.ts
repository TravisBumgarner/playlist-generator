import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const envVars = {
  local: {
    __API_WS_ENDPOINT__: JSON.stringify('wss://127.0.0.1:8000/graphql'),
    __API_HTTP_ENDPOINT__: JSON.stringify('https://127.0.0.1:8000/graphql'),
    __LOGGING_LEVEL__: JSON.stringify('local'),
  },
  production: {
    __API_WS_ENDPOINT__: JSON.stringify('/ws/graphql'),
    __API_HTTP_ENDPOINT__: JSON.stringify('/api/graphql'),
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
