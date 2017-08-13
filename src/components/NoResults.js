/**
 * Created by cody on 6/26/17.
 */
import React from 'react';
import {Link} from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';

export const NoResultsFound = (props) => (
  <div>
    <h2 className="App-intro">No results are available for {props.params.match.params.userLocation.toUpperCase()}.</h2>
    <h4 className="App-intro">Please submit a request to add your location and we will response within 24 hours.</h4>
    <br/>
    <Link to="/request" push>
      <RaisedButton
        label="Send Request"
        primary={true}
        className="button-style"
      />
    </Link>
  </div>
);