import React, {Component} from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './App.css';
import HomePage from './containers/HomePage';

class App extends Component {
    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme()}>
                <div className="App">
                    <h1 className="welcome-header"><strong>Welcome To HappyFinder!</strong></h1>
                    <HomePage/>
                    <p className="App-intro">
                        HappyFinder finds happy hours near the given location!<br /><br />Try it out!
                    </p>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
