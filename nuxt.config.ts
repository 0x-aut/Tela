// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  runtimeConfig: {
    connection_string: process.env.CONNECTION_STRING,
    better_auth_secret: process.env.BETTER_AUTH_SECRET,
    resend_api_key: process.env.RESEND_API_KEY,
  },

  css: [
    "~/assets/styles/main.scss"
  ],
  modules: ['@nuxt/fonts', '@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt'],
})