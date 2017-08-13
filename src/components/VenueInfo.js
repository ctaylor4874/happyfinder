/**
 * Created by codytaylor on 6/24/17.
 */
import React from 'react';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import {indigo500} from 'material-ui/styles/colors';
import Business from 'material-ui/svg-icons/communication/business';
import Info from 'material-ui/svg-icons/action/info';
import Star from 'material-ui/svg-icons/action/stars';

const ContactInfo = ({name, category, happyHourDetails, price, rating}) => (
  <div>
    <Paper zDepth={2}>
      <List>
        <ListItem
          rightIcon={<Business color={indigo500}/>}
          primaryText={<h2>{name}</h2>}
          secondaryText={category ? category : null}
        />
        <Divider />
        <ListItem
          disabled
          rightIcon={<Info color={indigo500}/>}
          primaryText="Happy Hour Details"
          secondaryText={(happyHourDetails !== 'Not Available') ? happyHourDetails.toUpperCase() : 'Details Not Available'}
          secondaryTextLines={2}
        />
        <Divider />
        <ListItem
          disabled
          rightIcon={<Star color={indigo500}/>}
          primaryText={`Price: ${price ? price : "Data Not Available"}`}
          secondaryText={`Rating: ${rating ? rating : "Data Not Available"}`}
        />
      </List>
    </Paper>
  </div>
);

export default ContactInfo;