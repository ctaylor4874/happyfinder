import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import injectTapEventPlugin from 'react-tap-event-plugin';

import reducers from './reducers';
import './index.css';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

injectTapEventPlugin();
ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <App />
  </Provider>
  , document.getElementById('root'));

registerServiceWorker();
