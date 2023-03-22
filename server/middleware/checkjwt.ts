import jwt from 'jsonwebtoken';
export default defineEventHandler((event) => {
    const url = event.node.req.url
    const method = event.node.req.method
    try {
        const token = event.node.req.headers.authorization
        if (url == '/api/login' || (url == '/api/posts' && method != 'GET')) {
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
        else {
            event.context.user = true
        }
    }
    catch (e) {
        console.log(e)
    }
})