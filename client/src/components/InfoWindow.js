/**
 * Created by cody on 6/21/17.
 */
import React from 'react';

export const infoWindow = (venues, refs) => (
  venues.map((venue) => {
    return (
      <div>
        <h3><a href="#" onClick={(e) => {
          const {fs_venue_id} = venue;
          e.preventDefault();
          // refs.forEach((ref) => {
          //   if (ref === fs_venue_id){
          //     ref.click();
          //   }
          })
        }}>{venue.name}</a></h3>
        <p>{venue.category}<span style={{float: 'right'}}>{Math.round(Number(venue.milesfromuser) * 100) / 100} miles</span></p>
      </div>
    )
  })
);