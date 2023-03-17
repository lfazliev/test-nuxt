// import Router from 'express'
import { ObjectId } from 'mongodb'
import client from '@/server/api/db'
import fs from 'fs'
import jwt from 'jsonwebtoken';
const db = client.db('blog', 'posts')
const dbheader = client.db('blog', 'header');
const dbtokens = client.db('blog', 'tokens')
// const router = Router()
//

// export default router
