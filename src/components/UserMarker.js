/**
 * Created by cody on 6/21/17.
 */
import React from "react";
import { CircleMarker } from "react-leaflet";

const userMarker = userInfo =>
  <CircleMarker
    center={[userInfo.latLng.lat, userInfo.latLng.lng]}
    color="red"
    radius={20}
    fillColor="red"
  />;

export default userMarker;
