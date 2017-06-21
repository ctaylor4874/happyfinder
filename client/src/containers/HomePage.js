/**
 * Created by cody on 5/31/17.
 */
import React, {Component} from 'react';

import LocationSearch from './LocationSearch'


class HomePage extends Component {
  render() {
    return(
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <LocationSearch />
          </div>
        </div>
      </div>
    )
  }
}

export default HomePage;