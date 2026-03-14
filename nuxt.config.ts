// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@vite-pwa/nuxt'],

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Happy Birthday - Biglietti di Compleanno',
      short_name: 'Happy Birthday',
      description: 'Crea e condividi biglietti di compleanno animati con mini-giochi interattivi',
      theme_color: '#ff6b9d',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      lang: 'it',
      start_url: '/',
      scope: '/',
      categories: ['entertainment', 'social'],
      icons: [
        {
          src: 'pwa-64x64.png',
          sizes: '64x64',
          type: 'image/png',
        },
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'pwa-maskable-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
    },
  },

  app: {
    head: {
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
        },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/icon.svg',
        },
        {
          rel: 'apple-touch-icon',
          href: '/apple-touch-icon.png',
        },
      ],
      meta: [
        { name: 'theme-color', content: '#ff6b9d' },
      ],
    },
  },

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  css: [
    '~/assets/css/main.css',
    '~/assets/css/themes.css',
    '~/assets/css/keyframes.css',
    '~/assets/css/pwa.css',
  ],

  nitro: {
    preset: 'netlify',
  },
})
