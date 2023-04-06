import Busboy from 'busboy'
import path from 'path'
import fs from 'fs'

const useFiles = async (event: any) => {
  const { req } = event
  if (req.method === 'POST' || req.method === 'PUT') {
    return new Promise((resolve) => {
      let ReqfileName: any
      const fields = {} as any
      const busboy = Busboy({ headers: req.headers })
      busboy.on('file', (n, file, info) => {
        const { filename, mimeType } = info
        const saveTo = path.join(process.cwd(), 'public', info.filename)
        file.pipe(fs.createWriteStream(saveTo))
        file.on('end', () => {
          ReqfileName = filename


        })
      })
      busboy.on('field', (name, value, info) => {
        fields[name] = value
      })
      busboy.on('finish', () => {
        event.context.fileName = ReqfileName
        event.context.fields = fields
        resolve({})
      })
      req.pipe(busboy)
    })
  }
}

export default useFiles