/**
 * Created by cody on 6/21/17.
 */
import React from "react";
import { Link } from "react-router-dom";
import Divider from "material-ui/Divider";

const infoWindow = (venues, selectedVenue) =>
  venues.map(venue => {
    return (
      <div className="info-window" key={venue.id_}>
        <h4>
          <Link
            to={`/happyhours/venue/${venue.id_}`}
            className="info-link"
            id={venue.id_}
            key={venue.id_}
          >
            {venue.id_ === selectedVenue ? <mark>{venue.name}</mark> : venue.name}
          </Link>
        </h4>
        <p>
          {venue.category}
          <span className="info-span">
            {Math.round(Number(venue.milesfromuser) * 100) / 100}
            miles
          </span>
        </p>
        <Divider />
      </div>
    );
  });

export default infoWindow;
