/**
 * Created by codytaylor on 6/24/17.
 */
/**
 * Created by cody on 6/23/17.
 */
import React from 'react';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';

const Hours = ({hours}) => (
  <Paper zDepth={2}>
    <div className="row">
      <div className="col-xs-12">
        <h4>Business Hours</h4>
      </div>
    </div>
    <Divider/>
    <div className="row">
      <div className="col-xs-12">
        <ul className="hours-list">
          {hours.map((day) => <div><Divider/><li className="hours-list-item">{day}</li></div>)}
        </ul>
      </div>
    </div>
  </Paper>
);

export default Hours;