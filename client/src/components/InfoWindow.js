/**
 * Created by cody on 6/21/17.
 */
import React from 'react';
import {Link} from 'react-router-dom';

export const infoWindow = (venues) => (
  venues.map((venue) => {
    return (
      <div className="info-window" key={venue.id_}>
        <h4>
          <Link
            to={`/happyhours/venue/${venue.id_}`}
            className="info-link"
            id={venue.id_}
            key={venue.id_}>
            {venue.name}
          </Link>
        </h4>
        <p>{venue.category}<span className="info-span">{Math.round(Number(venue.milesfromuser) * 100) / 100}
          miles</span></p>
      </div>
    )
  })
);