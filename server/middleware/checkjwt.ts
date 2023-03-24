import jwt from 'jsonwebtoken';
export default defineEventHandler((event) => {
    try {
        const token = event.node.req.headers.authorization
        if (token) {
            jwt.verify(token, '123key', (err: any) => {
                if (err) {
                    event.context.user = false
                } else {
                    event.context.user = true
                }
            });
        } else {
            event.context.user = false
        }
    }
    catch (e) {
        console.log(e)
    }
})