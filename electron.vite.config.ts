import react from '@vitejs/plugin-react';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import { fileURLToPath, URL } from 'node:url';
import { loadEnv } from 'vite';
import graphqlLoader from 'vite-plugin-graphql-loader';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const rendererConfig = {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('src/renderer/src', import.meta.url)),
        '@/constants': fileURLToPath(new URL('src/renderer/src/constants', import.meta.url)),
        '@/components': fileURLToPath(new URL('src/renderer/src/components', import.meta.url)),
        '@/routes': fileURLToPath(new URL('src/renderer/src/routes', import.meta.url)),
        '@/pages': fileURLToPath(new URL('src/renderer/src/pages', import.meta.url)),
        '@/libs': fileURLToPath(new URL('src/renderer/src/libs', import.meta.url)),
        '@/types': fileURLToPath(new URL('src/renderer/src/types', import.meta.url)),
        '@/hooks': fileURLToPath(new URL('src/renderer/src/hooks', import.meta.url)),
        '@/stores': fileURLToPath(new URL('src/renderer/src/stores', import.meta.url)),
        '@/services': fileURLToPath(new URL('src/renderer/src/services', import.meta.url)),
        '@/assets': fileURLToPath(new URL('src/renderer/src/assets', import.meta.url)),
        '@/utils': fileURLToPath(new URL('src/renderer/src/utils', import.meta.url)),
      },
    },
    server: {
      port: 5173,
      proxy: {},
      cors: true,
    },
    build: {
      sourcemap: true,
    },
    optimizeDeps: {
      include: ['msw'],
    },
    plugins: [react(), graphqlLoader()],
  };

  if (env.GRAPHQL_PROXY_HOST) {
    rendererConfig.server.proxy['/graphql'] = {
      target: env.GRAPHQL_PROXY_HOST,
      changeOrigin: true,
      cookieDomainRewrite: 'localhost',
      configure: (proxy) => {
        proxy.on('proxyReq', (proxyReq) => {
          proxyReq.setHeader('origin', env.GRAPHQL_PROXY_HOST);
        });
      },
    };
  }

  return {
    main: {
      plugins: [externalizeDepsPlugin()],
    },
    preload: {
      plugins: [externalizeDepsPlugin()],
    },
    renderer: rendererConfig,
  };
});
