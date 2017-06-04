/**
 * Created by codytaylor on 6/3/17.
 */
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import App from './App';
import MapLocations from './components/MapLocations';


const Routes = () => (
      <BrowserRouter>
        <div>
          <Route exact path="/" component={App} />
          <Route exact path="/locations" component={MapLocations} />
        </div>
      </BrowserRouter>
    );
export default Routes;
