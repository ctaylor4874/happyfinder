/**
 * Created by cody on 6/23/17.
 */
import React from 'react';
import {Card, CardTitle} from 'material-ui/Card';

const DetailsCard = ({title, data, isLink, url}) => (
  <div className="details-card">
    <div className="col-xs-4 col-sm-3">
      <Card>
        <CardTitle title={title} subtitle={data}/>
      </Card>
    </div>
  </div>
);
export default DetailsCard;