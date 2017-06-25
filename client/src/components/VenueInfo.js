/**
 * Created by codytaylor on 6/24/17.
 */
import React from 'react';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import {indigo500} from 'material-ui/styles/colors';
import Business from 'material-ui/svg-icons/communication/business';
import CommunicationPhone from 'material-ui/svg-icons/communication/phone';

const ContactInfo = ({name, category, happyHourDetails, price, rating}) => (
  <Paper zDepth={2}>
    <List>
      <ListItem
        rightIcon={<Business color={indigo500}/>}
        primaryText={name}
        secondaryText={category ? category : null}
        secondaryTextLines={2}
      />
      <Divider />
      <ListItem
        rightIcon={<CommunicationPhone color={indigo500}/>}
        primaryText="Happy Hour Details"
        secondaryText={(happyHourDetails !== 'Not Available') ? happyHourDetails.toUpperCase() : 'Details Not Available'}
        secondaryTextLines={2}
      />
      <Divider />
      <ListItem
        rightIcon={<CommunicationPhone color={indigo500}/>}
        primaryText="Price Rating From 0-5"
        secondaryText={price ? price : "Data Not Available"}
      />
      <Divider />
      <ListItem
        rightIcon={<CommunicationPhone color={indigo500}/>}
        primaryText="Rating From 0-5"
        secondaryText={rating ? rating : "Data Not Available"}
      />
    </List>
  </Paper>
);

export default ContactInfo;