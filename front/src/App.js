import React, { Component } from 'react';
import './App.css';
import Webcam from './Controls/Webcam'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Lizard Feels</h1>
        </header>
        <Webcam />
      </div>
    )
  }
}

export default App;
