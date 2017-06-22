/**
 * Created by cody on 6/21/17.
 */
import React from 'react';

export const infoWindow = (venues) => (
  venues.map((venue) => {
    return (
      <div className="info-window">
        <h4><a className="info-link" href="#" id={venue.fs_venue_id}>{venue.name}</a></h4>
        <p>{venue.category}<span className="info-span">{Math.round(Number(venue.milesfromuser) * 100) / 100} miles</span></p>
      </div>
    )
  })
);