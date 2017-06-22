/**
 * Created by cody on 6/21/17.
 */
import React from 'react';

const clickMarker = (refs, id) => {
  console.log(this.refs);
};
export const infoWindow = ({venues}) => (
  venues.map((venue) => {
    return (
      <div>
        <h3><a href="#" id={venue.fs_venue_id} onClick={(e) => clickMarker(e.target.id)}>{venue.name}</a></h3>
        <p>{venue.category}<span style={{float: 'right'}}>{Math.round(Number(venue.milesfromuser) * 100) / 100} miles</span></p>
      </div>
    )
  })
);