import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {connect} from 'react-redux';
import {
  Map,
  TileLayer,
  Marker,
  Popup,
  PropTypes as MapPropTypes,
} from 'react-leaflet'

const MyPopupMarker = ({children, position}) => (
  <Marker position={position}>
    <Popup>
      <span>{children}</span>
    </Popup>
  </Marker>
)
MyPopupMarker.propTypes = {
  children: MapPropTypes.children,
  position: MapPropTypes.latlng,
}

const MyMarkersList = ({markers}) => {
  const items = markers.map(({key, ...props}) => (
    <MyPopupMarker key={key} {...props} />
  ))
  return <div style={{display: 'none'}}>{items}</div>
}
MyMarkersList.propTypes = {
  markers: PropTypes.array.isRequired,
}

class MapComponent extends Component {
  state = {
    lat: 51.505,
    lng: -0.09,
    zoom: 13,
  }

  render() {
    const center = [this.state.lat, this.state.lng]
    // TODO: Render markers from api response
    const markers = [
      {key: 'marker1', position: [51.5, -0.1], children: 'My first popup'},
      {key: 'marker2', position: [51.51, -0.1], children: 'My second popup'},
      {key: 'marker3', position: [51.49, -0.05], children: 'My third popup'},
    ]
    return (
      <Map center={center} zoom={this.state.zoom}>
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <MyMarkersList markers={markers}/>
      </Map>
    )
  }
}

function mapStateToProps(state) {
  return {
    errors: state.errors,
    isLoading: state.isLoading,
    venues: state.venues.venues,
  }
}

export default connect(mapStateToProps)(MapComponent);