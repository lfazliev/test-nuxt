import fs from 'fs'
import { ObjectId } from 'mongodb'
import client from '@/db'
const db = client.db('blog', 'posts')
const router = createRouter()
router.get('/posts', defineEventHandler(async () => {
    const all = await db.find({}).toArray()
    return { all }
}))
router.post('/posts', defineEventHandler(async (event) => {
    const user = event.context.user
    if (user) {

        // let filedata = event.node.req.file
        // if (!request.file) {
        //     delete request.body.file
        // }
        // const res = await db.insertOne({ ...request.body, src: (filedata) ? filedata.originalname : '' })
        // return ({ result: res })

    }
    else {
        return (false)
    }
}))
router.put('/posts', defineEventHandler(async (event) => {
    const user = event.context.user
    const data = await readBody(event)
    console.log(data);

    // const da = data.p._id
    if (user) {
        // let filedata = event.node.req.file;
        // if ((data.src && filedata) || data.file == 'delete') {
        //     fs.unlinkSync(`../client/src/assets/${data.src}`)
        //     fs.unlinkSync(`../public/assets/${data.src}`)

        // }
        // const res = await db.updateOne({ _id: new ObjectId(data._id) }, { $set: { title: data.title, text: data.text, url: data.url, src: (filedata) ? filedata.originalname : ((data.file == 'delete') ? '' : data.src) } })
        // return ({ result: res })
    }
    else {
        return (false)
    }
}))
router.delete('/posts', defineEventHandler(async (event) => {
    const user = event.context.user
    const body = await readBody(event)
    const _id = body.p._id
    if (user) {

        // const res = await db.deleteOne({ _id: new ObjectId(_id) })
        // if (request.body.p.src) {
        //     // fs.unlinkSync(`../client/src/assets/${request.body.p.src}`)
        //     fs.unlinkSync(`../public/assets/${request.body.p.src}`)
        // }
        return ({ result: res })
    }
    else {
        return (false)
    }
}))


export default useBase('/api', router.handler)