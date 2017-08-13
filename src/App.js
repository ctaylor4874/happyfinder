// @flow
import React, { Component } from "react";
import propTypes from "prop-types";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import "./App.css";
import Routes from "./Routes";

class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div className="App">
          <Routes />
          {this.props.children}
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  children: propTypes.objectOf(propTypes.any).isRequired
};

export default App;
