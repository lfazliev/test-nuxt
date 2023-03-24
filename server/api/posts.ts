// router.get('/posts', async (request, response) => {
//     //console.log(request.query)
//     try {
//         const all = await db.find({}).toArray()
//         response.send({ all })
//     } catch (e) {
//         response.send({ result: 'error', data: e })
//     }
// })

// export default (req:any, res:any) => {
//     res.end('Legacy handler')
// }
import fs from 'fs'
import { ObjectId } from 'mongodb'
import client from '@/db'
const db = client.db('blog', 'posts')

export default defineEventHandler(async (event) => {
    let method = getMethod(event)
    let user = event.context.user
    switch (method) {
        case 'GET': {
            const all = await db.find({}).toArray()
            return { all }
        }
        case 'POST': {
            break;
        }
        case 'DELETE': {
            break;
        }
        case 'PUT': {
            // try {
            //     if (user) {
            //         let data = readBody(event)
            //         let filedata = request.file;
            //         if ((data.src && filedata) || data.file == 'delete') {
            //             // fs.unlinkSync(`../client/src/assets/${data.src}`)
            //             fs.unlinkSync(`../public/assets/${data.src}`)

            //         }
            //         const res = await db.updateOne({ _id: new ObjectId(data._id) }, { $set: { title: data.title, text: data.text, url: data.url, src: (filedata) ? filedata.originalname : ((data.file == 'delete') ? '' : data.src) } })
            //         return ({ result: res })
            //     }
            //     else {
            //         return (false)
            //     }
            // } catch (e) {
            //     response.send({ result: 'error', data: e })
            // }
            // break;
        }



    }
    try {
        // if (event.context.user == true) {
        // }


    } catch (e) {
        return (e)
    }
})


// router.put('/posts', async (request, response) => {

//
// })
// router.post('/posts', (request, response) => {
//     try {
//         const token = request.headers.authorization
//         if (token) {
//             jwt.verify(token, '123key', async (err) => {
//                 if (err) {
//                     response.send(false)
//                 } else {
//                     let filedata = request.file
//                     if (!request.file) {
//                         delete request.body.file
//                     }
//                     const res = await db.insertOne({ ...request.body, src: (filedata) ? filedata.originalname : '' })
//                     response.send({ result: res })
//                 }
//             });
//         }


//     } catch (e) {
//         response.send({ result: 'error', data: e })
//     }
// })

// router.delete('/posts', (request, response) => {
//     try {
//         const token = request.headers.authorization
//         if (token) {
//             jwt.verify(token, '123key', async (err) => {
//                 if (err) {
//                     response.send(false)
//                 } else {
//                     const res = await db.deleteOne({ _id: new ObjectId(request.body.p._id) })
//                     if (request.body.p.src) {
//                         // fs.unlinkSync(`../client/src/assets/${request.body.p.src}`)
//                         fs.unlinkSync(`../public/assets/${request.body.p.src}`)
//                     }
//                     response.send({ result: res })
//                 }
//             });
//         }


//     } catch (e) {
//         response.send({ result: 'error', data: e })
//     }
// })