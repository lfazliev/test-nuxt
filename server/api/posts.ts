import fs from 'fs'
import { ObjectId } from 'mongodb'
import client from '@/db'
const db = client.db('blog', 'posts')

export default defineEventHandler(async (event) => {
    try {
        let method = getMethod(event)
        let user = event.context.user
        switch (method) {
            case 'GET': {
                const all = await db.find({}).toArray()
                return { all }
            }
            case 'POST': {
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
            }
            case 'DELETE': {
                if (user) {
                    // const res = await db.deleteOne({ _id: new ObjectId(request.body.p._id) })
                    // if (request.body.p.src) {
                    //     // fs.unlinkSync(`../client/src/assets/${request.body.p.src}`)
                    //     fs.unlinkSync(`../public/assets/${request.body.p.src}`)
                    // }
                    // response.send({ result: res })
                }
                else {
                    return (false)
                }
            }
            case 'PUT': {
                if (user) {
                    let data = await readBody(event)
                    // let filedata = event.node.req.file; !!!!
                    // if ((data.src && filedata) || data.file == 'delete') {
                    //     fs.unlinkSync(`../client/src/assets/${data.src}`)
                    //     fs.unlinkSync(`../public/assets/${data.src}`)

                    // }
                    const res = await db.updateOne({ _id: new ObjectId(data._id) }, { $set: { title: data.title, text: data.text, url: data.url, src: (filedata) ? filedata.originalname : ((data.file == 'delete') ? '' : data.src) } })
                    return ({ result: res })
                }
                else {
                    return (false)
                }
            }
        }




    } catch (e) {
        return ({ result: 'error', data: e })
    }
})