const fs = require('fs')
const express = require('express')
const fileUpload = require('express-fileupload')
const multer = require('multer');
const cors = require('cors')
const emotionRecognizer = require('./emotionRecognizer')
const path = require('path')

const app = express()
const upload = multer()

app.use(cors())

app.post('/detect', upload.array(), function(req, res) {
  const base64Data = req.body.image.replace(/^data:image\/jpeg;base64,/, '')
  const filePath = path.join(__dirname, 'uploads', 'out.jpg')

  fs.writeFile(filePath, base64Data, 'base64', function(err) {
    if (err) console.log(err);

    const emotions = emotionRecognizer(filePath)

    emotions.then(emotions => {
      console.log('emotions', emotions)
      res.send(emotions)
    })
  })
})

app.use('/', express.static(__dirname + '/front/build'))
app.use('/static', express.static(__dirname + '/front/build/static'))

const port = process.env.NODE_ENV === 'production' ? 3000 : 3001

app.listen(3001)
