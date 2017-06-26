/**
 * Created by cody on 6/20/17.
 */
import React from 'react';
import {Link} from 'react-router-dom';
import {Marker, Popup} from 'react-leaflet';

export const makeMarkers = (venues) => (
  venues.map((venue) => {
    return (
      <Marker
        position={[venue.lat, venue.lng]}
        riseOnHover={true}
        key={venue.id_}
      >
        <Popup>
          <span>
            <Link
              to={`/happyhours/venue/${venue.id_}`}
              className="info-link"
              id={venue.id_}
              key={venue.id_}>
            {venue.name}
          </Link>
            <p><strong>Category: </strong>{venue.category}</p>
            <p><strong>Miles Away: </strong>{Math.round(Number(venue.milesfromuser) * 100) / 100}</p>
            <p><strong>Happy Hour Details:</strong><br/>{(venue.happy_hour_string === 'Not Available') ?
              'Details Not Available' :
              venue.happy_hour_string.toUpperCase()}</p>
            {/*<p><ul id="hours-list">{cleanHours(venue.hours)}</ul></p>*/}
          </span>
        </Popup>
      </Marker>
    )
  })
)