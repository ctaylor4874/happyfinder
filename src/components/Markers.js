/**
 * Created by cody on 6/20/17.
 */
import React from "react";
import PropTypes from 'prop-types'
import { Marker, Popup } from "react-leaflet";

class MakeMarkers extends React.Component {
  static propTypes = {
    venues: PropTypes.arrayOf(PropTypes.any).isRequired
  }

  goToVenue(id){
    this.context.router.history.push(`/happyhours/venue/${id}`);
  }

  render() {
    return this.props.venues.map(venue => {
      return (
        <Marker position={[venue.lat, venue.lng]} riseOnHover key={venue.id_}>
          <Popup>
          <span>
            <h3 onClick={() => this.goToVenue(venue.id_)}>
              {venue.name}
            </h3>
            <p>
              <strong>Category: </strong>
              {venue.category}
            </p>
            <p>
              <strong>Miles Away: </strong>
              {Math.round(Number(venue.milesfromuser) * 100) / 100}
            </p>
            <p>
              <strong>Happy Hour Details:</strong>
              <br />
              {venue.happy_hour_string === "Not Available"
                ? "Details Not Available"
                : venue.happy_hour_string.toUpperCase()}
            </p>
          </span>
          </Popup>
        </Marker>
      );
    });
  }
}

export default makeMarkers;
