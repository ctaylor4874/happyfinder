import React, {Component} from 'react';
import {Map, TileLayer} from 'react-leaflet';
import {latLngBounds} from 'leaflet';
import {connect} from 'react-redux';

import {NoResultsFound} from '../components/NoResults';
import Loading from '../components/Loading';
import {infoWindow} from '../components/InfoWindow';
import {getVenues} from '../actions/index';
import {makeMarkers} from '../components/Markers';
import {userMarker} from '../components/UserMarker';
import {radius} from '../components/SearchRadius';

class MapComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: null,
      mapLoaded: false,
      noResults: false,
    };
  }

  updateDimensions() {
    const height = window.innerHeight - 138;
    this.setState({height});
  }

  componentWillMount() {
    this.props.getVenues(this.props.match.params)
      .then(() => {
        if (this.props.venues.length) {
          this.updateDimensions();
          this.setState({mapLoaded: true});
        } else {
          this.setState({
            noResults: true,
            mapLoaded: true,
          });
        }
      });
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  render() {
    const {userInfo, venues} = this.props;
    const {mapLoaded, noResults} = this.state;
    let bounds;

    if (!(mapLoaded)) {
      return (
        <Loading/>
      )
    } else if (noResults) {
      return (
        <NoResultsFound params={this.props} />
      );
    } else {
      bounds = latLngBounds([userInfo.latLng.lat, userInfo.latLng.lng]);
      venues.forEach((data) => {
        bounds.extend([data.lat, data.lng])
      });
    }
    return (
      <div>
        <div
          className="col-sm-6 col-xs-4"
          style={{backgroundColor: 'rgba(255,255,255,0.5)', overflowY: 'scroll', height: this.state.height}}>
          {infoWindow(this.props.venues)}
        </div>
        <div className="map-container col-sm-6 col-xs-8" style={{height: this.state.height, padding: 0}}>
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

export default connect(mapStateToProps, {getVenues})(MapComponent);