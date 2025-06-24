import {Router} from "express"
import multer from "multer"
import {path, __dirname} from "../utils/import_path.ts"

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, '/uploads'))
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
//   }
// })

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {files: 2} 
})

import * as home from "../controller/home.controller.ts"

const routes = Router()

routes.get("/", home.get_home)
routes.post("/upload_file", upload.array("file"), home.upload_file)

export default routes