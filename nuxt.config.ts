// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  css: [
    "~/assets/styles/main.scss"
  ],
  modules: ['@nuxt/fonts']
})