const express = require('express');
const bodyParser = require('body-parser')
const authenticate = require('../authenticate')
const multer = require('multer')
const cors = require('./cors')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public\\images')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|gif|png|jpeg)$/)) {
    return cb(new Error('Ypu can upload only image files'))
  }
  cb(null, true)
}

const upload = multer({ storage: storage, fileFilter: imageFileFilter })


const uploadRoute = express.Router()
uploadRoute.use(bodyParser.json());

uploadRoute.route('/')
  .options(cors.corsWithOptions, (res, req) => { res.sendStatus(200) })
  .get(cors.cors, [authenticate.verifyUser, authenticate.verifyAdmin],
    (req, res, next) => {
      res.statusCode = 403;
      res.end("Get operation is not support on /imageUpload")
    }
  )
  .post(cors.corsWithOptions, [authenticate.verifyUser, authenticate.verifyAdmin],
    upload.single('imageFile'), (req, res) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json')
      res.json(req.file)
    }
  )
  .put(cors.corsWithOptions, [authenticate.verifyUser, authenticate.verifyAdmin],
    (req, res, next) => {
      res.statusCode = 403;
      res.end("Put operation is not support on /imageUpload")
    }
  )
  .delete(cors.corsWithOptions, [authenticate.verifyUser, authenticate.verifyAdmin],
    (req, res, next) => {
      res.statusCode = 403;
      res.end("delete operation is not support on /imageUpload")
    }
  )

module.exports = uploadRoute