import jwt from 'jsonwebtoken';
export default defineEventHandler((event) => {
    try {
        const token = event.node.req.headers.authorization
        if (token) {
            jwt.verify(token, '123key', (err: any) => {
                if (err) {
                    send(event, false)
                } else {
                    next()
                }
            });
        }
    }
    catch (e) {
        send(event, { result: 'error', data: e })
    }
})