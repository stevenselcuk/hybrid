// import multer from 'multer'
// import crypto from 'crypto'
// import { extname, resolve } from 'path'
// import conf from './config'

// let storage = null

// if (conf.get('ON_HEROKU') === false) {
//  storage = multer.diskStorage({
//    destination: resolve(__dirname, '..', '..', 'public', 'uploads'),
//    filename: (req, file, callback) => {
//      crypto.randomBytes(16, (err, res) => {
 //       if (err) return callback(err)
//
 //       return callback(null, res.toString('hex') + extname(file.originalname))
 //     })
//    }
//  })
// }

// const upload = multer({ storage })
// export default upload
