/**
 * Created by cody on 6/20/17.
 */
import React from 'react';

import { Marker, Popup } from 'react-leaflet';

export const makeMarkers = (venues) => (
  venues.map((venue) => {
    return (
      <Marker position={[venue.lat, venue.lng]} id={venue.fs_venue_id}>
        <Popup>
          <span>
            <h3>{venue.name}</h3>
            <p><strong>Address: </strong>{venue.address}</p>
            <p><strong>Category: </strong>{venue.category}</p>
            <p><strong>Miles Away: </strong>{Math.round(Number(venue.milesfromuser) * 100) / 100}</p>
            <p></p>
          </span>
        </Popup>
      </Marker>
    )
  })
)