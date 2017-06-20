import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {Map, TileLayer} from 'react-leaflet';
import {connect} from 'react-redux';

import {getVenues} from '../actions/index';
import {makeMarkers} from '../components/Markers';
import {radius} from '../components/SearchRadius';

class MapComponent extends Component {
  render() {
    let userInfo = this.props.userInfo;
    if (!(this.props.userInfo.latLng)) {
      this.props.getVenues(this.props.match.params);
      return(
        <div className="container">
          <h1 style={{color: 'white', marginLeft: '20', marginTop: '20'}}>Loading...</h1>
        </div>
      )
    }
    return (
      <div className="col-xs-3">
        <Map center={[userInfo.latLng.lat, userInfo.latLng.lng]} zoom={12}>
          <TileLayer
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {makeMarkers(this.props.venues)}
          {radius(this.props.userInfo)}
        </Map>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    errors: state.errors,
    isLoading: state.isLoading,
    userInfo: state.venues.userInfo,
    venues: state.venues.venues,
  }
}

export default connect(mapStateToProps, {getVenues})(MapComponent)