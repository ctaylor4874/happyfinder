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
          <h1 className="welcome-header">Welcome To HappyFinder!</h1>
          <HomePage/>
        <p className="App-intro">
          HappyFinder finds happy hours near the given location!<br />Try it out!
        </p>
      </div>
    );
  }
}

export default App;
