import React, {Component} from 'react';
import {Map, TileLayer} from 'react-leaflet';
import {latLngBounds} from 'leaflet';
import {connect} from 'react-redux';

import {getVenues} from '../actions/index';
import {makeMarkers} from '../components/Markers';
import {userMarker} from '../components/UserMarker';
import {radius} from '../components/SearchRadius';

class MapComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: null,
    };
    this.infoWindow = this.infoWindow.bind(this);
  }

  updateDimensions() {
    const height = window.innerHeight;
    this.setState({height});
  }

  componentWillMount() {
    this.props.getVenues(this.props.match.params)
      .then(this.updateDimensions());
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  infoWindow(venue) {
    return (
      <div>
        <h3><a href="#" id={venue.fs_venue_id} onClick={(e) => {
          let x = document.
          console.log(x)
          // this.refs.map.props.children[1].forEach((item) => {
          //   if (item.props.id === e.target.id){
          //     console.log(item);
          //   }
          // })
        }}>{venue.name}</a></h3>
        <p>{venue.category}<span style={{float: 'right'}}>{Math.round(Number(venue.milesfromuser) * 100) / 100}
          miles</span></p>
      </div>
    )
  };

  render() {
    const {userInfo, venues} = this.props;
    let bounds;
    if (!(venues.length)) {
      return (
        <div className="container">
          <h1 style={{color: 'white', marginLeft: '20', marginTop: '20'}}>Loading...</h1>
        </div>
      )
    } else {
      bounds = latLngBounds([userInfo.latLng.lat, userInfo.latLng.lng]);
      venues.forEach((data) => {
        bounds.extend([data.lat, data.lng])
      });
    }
    return (
      <div>
        <div className="col-sm-6 col-xs-4" style={{backgroundColor: 'rgba(255,255,255,0.5)'}}>
          {this.props.venues.map((venue) => this.infoWindow(venue))}
        </div>
        <div className="map-container col-sm-6 col-xs-8" style={{height: this.state.height, paddingRight: 0}}>
          <Map
            style={{height: this.state.height}}
            center={[userInfo.latLng.lat, userInfo.latLng.lng]}
            ref="map"
            bounds={bounds}
            boundsOptions={{padding: [50, 50]}}
          >
            <TileLayer
              url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {makeMarkers(venues)}
            {userMarker(userInfo)}
            {radius(userInfo)}
          </Map>
        </div>
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