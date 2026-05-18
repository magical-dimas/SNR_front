import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react'
// import mkcert from 'vite-plugin-mkcert';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['logo1.png'],
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html'
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        
        navigateFallback: '/SNR_front/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        
        runtimeCaching: [
          {
            urlPattern: ({ request }) => {
              return request.destination === 'script' || 
                     request.destination === 'style' ||
                     request.destination === 'font';
            },
            handler: 'NetworkFirst',
            options: {
              cacheName: 'static-resources-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          }
        ]
      },

      manifest: {
        name: 'SNR Calculator',
        short_name: 'SNRC',
        description: 'Приложение для расчета параметров малых реакторов',
        theme_color: '#663300',
        background_color: '#FFCF73',
        display: 'standalone',
        scope: '/SNR_front/',
        start_url: '/SNR_front/',
        icons: [
          {
            src: 'logo1-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo1-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'logo1-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        screenshots: [
          {
            src: '/SNR_front/screenshot-wide.png',
            sizes: '2560x1424',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Главная страница приложения'
          },
          {
            src: '/SNR_front/screenshot-mobile.png',
            sizes: '720x1424',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Мобильная версия'
          }
        ]
      }
    })],
  server: {
    port: 52840,
    strictPort: true,
    host: true,
    proxy: {
      '/api': {
        target: 'http://10.46.79.236:8080',
        changeOrigin: true,
      }
    }
  }
})