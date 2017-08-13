/**
 * Created by codytaylor on 6/24/17.
 */
import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import {circleProgressStyle} from '../styles/style';

const Loading = () => (
  <div className="container loading-container">
    <CircularProgress style={circleProgressStyle} size={80} thickness={7} />
  </div>
);

export default Loading;
