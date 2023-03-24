import client from '@/db'
const dbheader = client.db('blog', 'header');
const dbtokens = client.db('blog', 'tokens')
import jwt from 'jsonwebtoken';
export default defineEventHandler(async (event) => {
    try {
        const data = await readBody(event)
        console.log(data);
        return { login: data.login, pass: data.pass }
        const user = await dbheader.findOne({ login: data.login });
        if (!user) {
            return (false)
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
                return (true)
            }
            else {
                return (false)
            }
        }

    } catch (e) {
        return { result: 'error', data: e }
    }
})