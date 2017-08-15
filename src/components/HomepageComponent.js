/**
 * Created by cody on 6/22/17.
 */
import React from "react";

import LocationSearch from "../containers/LocationSearch";

const HomepageComponent = () =>
  <div className="homepage-component">
    <h1 className="welcome-header">
      <strong>Welcome To HappyFinder!</strong>
    </h1>
    <div>
      <LocationSearch />
    </div>
  </div>;

export default HomepageComponent;
