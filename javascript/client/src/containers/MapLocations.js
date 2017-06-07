import React, {Component} from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import {connect} from 'react-redux';

class MapComponent extends Component {
  render() {
    return (
      <div className="col-xs-3">
      <Map center={[33.85433699999997, -117.76149049999967]} zoom={13}>
    <TileLayer
      url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    />
    <Marker position={[33.85433699999997, -117.76149049999967]}>
      <Popup>
        <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
      </Popup>
    </Marker>
  </Map>
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    errors: state.errors,
    isLoading: state.isLoading,
    venues: state.venues.venues,
  }
}

export default connect(mapStateToProps)(MapComponent)