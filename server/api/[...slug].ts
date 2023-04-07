import fs from 'fs'
import { ObjectId } from 'mongodb'
import useFiles from '~~/helpers/useFiles'
import client from '@/db'
import path from 'path'
const db = client.db('blog', 'posts')
const router = createRouter()
router.get('/posts', defineEventHandler(async () => {
    const all = await db.find({}).toArray()
    return { all }
}))
router.post('/posts', defineEventHandler(async (event) => {
    try {
        const user = event.context.user
        if (user) {
            await useFiles(event)
            let data = event.context.fields
            let filename = event.context.fileName
            if (filename) {
                console.log(filename);
            }
            if (data) {
                const res = await db.insertOne({ ...data, src: (filename) ? filename : '' })
                return ({ result: res })
            }
            else {
                console.log("res without data");

            }

        }
        else {
            return ({ result: 'user', data: false })
        }
    }
    catch (e) {
        return ({ result: 'error', data: e })
    }
}))
router.put('/posts', defineEventHandler(async (event) => {
    try {
        const user = event.context.user
        if (user) {
            await useFiles(event)
            let data = event.context.fields
            let filename = event.context.fileName
            const _id = data._id
            if ((data.src && filename) || data.file == 'delete') {
                const src = path.join(process.cwd(), 'public', data.src)
                fs.unlinkSync(src)

            }
            const res = await db.updateOne({ _id: new ObjectId(data._id) }, { $set: { title: data.title, text: data.text, url: data.url, src: (filename) ? filename : ((data.file == 'delete') ? '' : data.src) } })
            return ({ result: res })
        }
        else {
            return ({ result: false })
        }
    }
    catch (e) {
        return ({ result: 'error', data: e })
    }
}))
router.delete('/posts', defineEventHandler(async (event) => {
    try {
        const user = event.context.user
        const body = await readBody(event)
        const _id = body.p._id
        if (user) {
            const res = await db.deleteOne({ _id: new ObjectId(_id) })
            if (body.p.src) {
                const src = path.join(process.cwd(), 'public', body.p.src)
                fs.unlinkSync(src)
            }
            return ({ result: res })
        }
        else {
            return ({ result: false })
        }
    }
    catch (e) {
        return ({ result: 'error', data: e })
    }
}))


export default useBase('/api', router.handler)