/**
 * Created by codytaylor on 6/3/17.
 */
import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import MenuBar from './components/Nav';
import Footer from './components/Footer';
import HomepageComponent from './components/HomepageComponent';
import MapLocations from './containers/MapLocations';
import VenueDetails from './containers/VenueDetails';
import Email from './containers/Email';
import RequestNewCity from './containers/RequestNewCity';


const Routes = () => (
      <BrowserRouter>
        <div>
          <MenuBar/>
          <Route exact path="/" component={HomepageComponent} />
          <Route path="/happyhours/location/:userLocation/:radius" component={MapLocations} />
          <Route path="/happyhours/venue/:id_" component={VenueDetails} />
          <Route path="/request" component={RequestNewCity} />
          <Route path="/contact" component={Email} />
          <Footer/>
        </div>
      </BrowserRouter>
    );
export default Routes;
