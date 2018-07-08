/**
 * Created by cody on 6/20/17.
 */
import React from "react";
import { Link } from "react-router-dom";
import { Marker, Popup } from "react-leaflet";

const makeMarkers = venues =>
  venues.map(venue => {
    return (
      <Marker position={[venue.lat, venue.lng]} riseOnHover key={venue.id_}>
        <Popup>
          <span>
            <Link
              to={`/happyhours/venue/${venue.id_}`}
              className="info-link"
              id={venue.id_}
              key={venue.id_}
            >
            <h3>
              {venue.name}
            </h3>
          </Link>
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

export default makeMarkers;
