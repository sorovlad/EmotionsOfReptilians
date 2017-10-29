require('dotenv').config()
const oxford = require('project-oxford')
const client = new oxford.Client(process.env.AZURE_EMOTION_KEY)

function getEmotion(path) {
  const data = { path }

  return client.emotion.analyzeEmotion(data)
    .catch(console.log)
}

module.exports = getEmotion
