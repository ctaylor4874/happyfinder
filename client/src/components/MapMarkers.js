/**
 * Created by cody on 6/7/17.
 */
import React, {Component} from 'react';
import {Gmaps, Marker, InfoWindow, Circle} from 'react-gmaps';
const coords = {
  lat: 51.5258541,
  lng: -0.08040660000006028
};
const coord = {
  lat: 52.5258541,
  lng: -1.08040660000006028
};
export const Markers = (props) => {
  console.log(props)
  return (
       <Marker
          lat={coords.lat}
          lng={coords.lng}
       />
  )
};