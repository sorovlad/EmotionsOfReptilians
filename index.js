const fs = require('fs')
const express = require('express')
const fileUpload = require('express-fileupload')
const multer = require('multer');
const cors = require('cors')
const emotionRecognizer = require('./emotionRecognizer')
const path = require('path')
const cmd = require('node-cmd')

const app = express()
const upload = multer()

app.use(cors())

const directoryUpload = 'uploads'

app.post('/detect', upload.array(), function(req, res) {
const base64Data = req.body.image.replace(/^data:image\/jpeg;base64,/, '')
const filePath = path.join(__dirname, directoryUpload, 'out.jpg')

if (!fs.existsSync(directoryUpload)){
fs.mkdirSync(directoryUpload)
}

fs.writeFile(filePath, base64Data, 'base64', (err) => {
if (err) console.log(err);

const callback = (err, data, stderr) => {
  // console.log('callback', err, data, stderr)
if (err) return

const emotions = emotionRecognizer(filePath)

emotions.then(emotions => {
  if (emotions[0]) {
    emotions[0].reptilian = data
  }
res.send(emotions)
})

}

const command = 'recognize.bat'
cmd.get(command, callback)
})
})

app.use('/', express.static(__dirname + '/front/build'))
app.use('/static', express.static(__dirname + '/front/build/static'))

const port = process.env.PORT || 3001

app.listen(port)