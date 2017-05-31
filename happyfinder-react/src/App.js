import React, { Component } from 'react';
import header from './images/header.jpg';
import './App.css';
import HomePage from './containers/HomePage';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={header} className="App-header-image" alt="header" />
        </div>
          <HomePage/>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
