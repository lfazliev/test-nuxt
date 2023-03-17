import client from '@/server/api/db'
const dbheader = client.db('blog', 'header');
const dbtokens = client.db('blog', 'tokens')
import jwt from 'jsonwebtoken';
export default defineEventHandler(async (event) => {
    try {
        const data = await readBody(event)
        const user = await dbheader.findOne({ login: data.login });
        if (!user) {
            send(event, false)
        }
        else {
            if (user.pwd == data.pwd) {
                const token = jwt.sign({ userId: user._id }, '123key', { expiresIn: '7d' })
                await dbtokens.insertOne({ token })
                appendResponseHeaders(event, {
                    'Access-Control-Expose-Headers': 'Authorization',
                    'Authorization': token
                }
                )
                send(event, true)
            }
            else {
                send(event, false)
            }
        }

    } catch (e) {
        send(event, { result: 'error', data: e })
    }
})