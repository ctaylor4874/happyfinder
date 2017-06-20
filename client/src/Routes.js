/**
 * Created by codytaylor on 6/3/17.
 */
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import App from './App';
import MapLocations from './containers/MapLocations';


const Routes = () => (
      <BrowserRouter>
        <div>
          <Route exact path="/" component={App} />
          <Route exact path="/happyhours/:userLocation/:radius" component={MapLocations} />
        </div>
      </BrowserRouter>
    );
export default Routes;
