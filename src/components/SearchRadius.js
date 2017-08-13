/**
 * Created by cody on 6/20/17.
 */
import React from 'react';
import {Circle} from 'react-leaflet';

export const radius = (props) => {
  return (
    <Circle
      center={[props.latLng.lat, props.latLng.lng]}
      radius={props.radius * 1609.34}
      fillOpacity={.1}
      fillColor="whitesmoke"
      color="blue"
    />
  );
};