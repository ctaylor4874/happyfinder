/**
 * Created by cody on 6/20/17.
 */
import React from 'react';

import {Marker, Popup} from 'react-leaflet';

function cleanHours(s) {
  // console.log(s)
  s = s.split(', ', '\n');
  return s;
}

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
            <h3>{venue.name}</h3>
            <p><strong>Address: </strong>{venue.address}</p>
            <p><strong>Website: </strong><a href={venue.url} target="_blank"
                                            rel="noopener noreferrer">{venue.url}</a></p>
            <p><strong>Category: </strong>{venue.category}</p>
            <p><strong>Miles Away: </strong>{Math.round(Number(venue.milesfromuser) * 100) / 100}</p>
            <p><strong>Hours: </strong>{cleanHours(venue.hours)}</p>
            <p><strong>Phone Number: </strong>{venue.phone_number}</p>
            <p><strong>Price: </strong>{venue.price} out of 5</p>
            <p><strong>Rating: </strong>{venue.rating} out of 5</p>
          </span>
        </Popup>
      </Marker>
    )
  })
)