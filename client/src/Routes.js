/**
 * Created by codytaylor on 6/3/17.
 */
import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import MenuBar from './components/Nav';
import Footer from './components/Footer';
import HomepageComponent from './components/HomepageComponent';
import MapLocations from './containers/MapLocations';
import Email from './containers/Email';


const Routes = () => (
      <BrowserRouter>
        <div>
          <MenuBar/>
          <Route exact path="/" component={HomepageComponent} />
          <Route exact path="/happyhours/:userLocation/:radius" component={MapLocations} />
          <Route exact path="/contact" component={Email} />
          <Footer/>
        </div>
      </BrowserRouter>
    );
export default Routes;
