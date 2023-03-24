export default defineEventHandler(async (event) => {
    try {
        return event.context.user ? { auth: true } : { auth: false }
    }
    catch (e) {
        return { result: 'error', data: e }
    }
})