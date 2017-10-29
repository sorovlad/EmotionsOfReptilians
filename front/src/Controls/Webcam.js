import React from 'react'
import Webcam from 'react-webcam'
import Button from 'ui/Button'

const urlToRequest = process.env.NODE_ENV === 'production'
  ? '/detect'
  : 'http://localhost:3001/detect'

export default class WebcamCapture extends React.Component {
  state = { data: [] }
  setRef = (webcam) => {
    this.webcam = webcam
  }

  capture = () => {
    const image = this.webcam.getScreenshot()

    this.sendImage(image, this.state.data.length)
    this.setState({ data: [...this.state.data, { image }] })
  }

  sendImage = (image, index) => {
    Promise.resolve()
      .then(file => {
        const formData = new FormData()
        formData.append("image", image)

        return fetch(urlToRequest, {
          method: 'POST',
          body: formData,
          mode: process.env.NODE_ENV === 'production' ? 'cors' : 'none',
          responseType: 'json'
        })
      })
      .then(response => response.json())
      .then(emotions => {
        const item = { ...this.state.data[index], emotions }
        const data = [...this.state.data]
        data[index] = item

        this.setState({ data })
      })
      .catch(console.log)
  }


  runCapture = () => {
    if (this.capturing) return

    this.capturing = setInterval(this.capture, 5000)
    this.timer = setTimeout(this.stopCapture, 20000)
  }
  stopCapture = () => {
    if (!this.capturing) return

    clearInterval(this.capturing)
    clearTimeout(this.timer)

    this.capturing = null
    this.timer = null
  }

  render() {
    return (
      <div className="webcam">
        <div className="webcam-controls">
          <Webcam
            audio={false}
            height={350}
            ref={this.setRef}
            screenshotFormat="image/jpeg"
            width={350}
          />
          <div>
            <Button onClick={this.capture}>Кадр</Button>
            <Button onClick={this.runCapture}>Запуск</Button>
            <Button onClick={this.stopCapture}>Остановка</Button>
          </div>
        </div>
        <div>
          {
            this.state.data.map(({ image, emotions = [] }) => {
              return (
                <div className="image-result">
                  <img src={image} alt="i" />
                  {
                    emotions.map(({ faceRectangle, scores }) => (
                      <div>
                        {faceRectangle ? `rect: ${JSON.stringify(faceRectangle)}` : null}
                        {renderScores(scores)}
                      </div>
                    ))
                  }
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

function renderScores(scores) {
  if (!scores) return null
  const {
  anger,
  contempt,
  disgust,
  fear,
  happiness,
  neutral,
  sadness,
  surprise,
   } = scores

  return <div>
    <div>anger: {anger}</div>
    <div>contempt: {contempt}</div>
    <div>disgust: {disgust}</div>
    <div>fear: {fear}</div>
    <div>happiness: {happiness}</div>
    <div>neutral: {neutral}</div>
    <div>sadness: {sadness}</div>
    <div>surprise: {surprise}</div>
  </div>
}
