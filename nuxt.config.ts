import mongo from './db'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    css: ['@/assets/css/main.scss'],
    modules: [
        '@pinia/nuxt',
        '@nuxt/image',
    ],
    imports: {
        dirs: ['/stores'],
    },
    pinia: {
        autoImports: ['defineStore', 'mapStores', ''],
    },
    typescript: {
        shim: false
    },
    hooks: [
        { 'ready': async () => { await mongo.connect() } },
        { 'close': () => { mongo.close() } }
    ]
})
