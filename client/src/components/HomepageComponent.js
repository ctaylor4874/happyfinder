/**
 * Created by cody on 6/22/17.
 */
import React from 'react';

import LocationSearch from '../containers/LocationSearch';

const HomepageComponent = () => (
  <div>
    <h1 className="welcome-header"><strong>Welcome To HappyFinder!</strong></h1>
    <div>
      <LocationSearch />
    </div>
    <p className="App-intro">
      HappyFinder finds happy hours near the given location!<br /><br />Try it out!
    </p>
  </div>
);

export default HomepageComponent;