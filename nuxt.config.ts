// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    css: ['@/assets/css/main.scss'],
    modules: [
        '@pinia/nuxt',
    ],
    imports: {
        dirs: ['/stores'],
    },
    pinia: {
        autoImports: ['defineStore', 'mapStores', ''],
    },
})
