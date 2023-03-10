import Router from 'express'
import { ObjectId } from 'mongodb'
import client from '@/db'
import fs from 'fs'
import jwt from 'jsonwebtoken';
const db = client.db('blog', 'posts')
const dbheader = client.db('blog', 'header');
const dbtokens = client.db('blog', 'tokens')
const router = Router()
router.get('/posts', async (request, response) => {
    //console.log(request.query)
    try {
        const all = await db.find({}).toArray()
        response.send({ all })
    } catch (e) {
        response.send({ result: 'error', data: e })
    }
})

router.put('/posts', async (request, response) => {

    try {
        const token = request.headers.authorization
        if (token) {
            jwt.verify(token, '123key', async (err) => {
                if (err) {
                    response.send(false)
                } else {
                    let data = request.body
                    let filedata = request.file;
                    if ((data.src && filedata) || data.file == 'delete') {
                        // fs.unlinkSync(`../client/src/assets/${data.src}`)
                        fs.unlinkSync(`../public/assets/${data.src}`)

                    }
                    const res = await db.updateOne({ _id: new ObjectId(data._id) }, { $set: { title: data.title, text: data.text, url: data.url, src: (filedata) ? filedata.originalname : ((data.file == 'delete') ? '' : data.src) } })
                    response.send({ result: res })
                }
            });
        }

    } catch (e) {
        response.send({ result: 'error', data: e })
    }
})
router.post('/posts', (request, response) => {
    try {
        const token = request.headers.authorization
        if (token) {
            jwt.verify(token, '123key', async (err) => {
                if (err) {
                    response.send(false)
                } else {
                    let filedata = request.file
                    if (!request.file) {
                        delete request.body.file
                    }
                    const res = await db.insertOne({ ...request.body, src: (filedata) ? filedata.originalname : '' })
                    response.send({ result: res })
                }
            });
        }


    } catch (e) {
        response.send({ result: 'error', data: e })
    }
})

router.delete('/posts', (request, response) => {
    try {
        const token = request.headers.authorization
        if (token) {
            jwt.verify(token, '123key', async (err) => {
                if (err) {
                    response.send(false)
                } else {
                    const res = await db.deleteOne({ _id: new ObjectId(request.body.p._id) })
                    if (request.body.p.src) {
                        // fs.unlinkSync(`../client/src/assets/${request.body.p.src}`)
                        fs.unlinkSync(`../public/assets/${request.body.p.src}`)
                    }
                    response.send({ result: res })
                }
            });
        }


    } catch (e) {
        response.send({ result: 'error', data: e })
    }
})
router.post('/login', async (request, response) => {
    try {
        const data = request.body
        const user = await dbheader.findOne({ login: data.login });
        if (!user) {
            response.send(false)
        }
        else {
            if (user.pwd == data.pwd) {
                const token = jwt.sign({ userId: user._id }, '123key', { expiresIn: '7d' })
                await dbtokens.insertOne({ token })
                response.set({
                    'Access-Control-Expose-Headers': 'Authorization',
                    'Authorization': token
                })
                response.send(true);
            }
            else {
                response.send(false)
            }
        }

    } catch (e) {
        response.send({ result: 'error', data: e })
    }
})
router.post('/checkjwt', async (request, response) => {
    try {
        const token = request.headers.authorization
        if (token) {
            jwt.verify(token, '123key', (err) => {
                if (err) {
                    response.send(false)
                } else {
                    response.send(true)
                }
            });
        }
    }
    catch (e) {
        response.send({ result: 'error', data: e })
    }
})
export default router
