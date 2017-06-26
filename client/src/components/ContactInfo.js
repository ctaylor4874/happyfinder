/**
 * Created by cody on 6/23/17.
 */
import React from 'react';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import {indigo500} from 'material-ui/styles/colors';
import Business from 'material-ui/svg-icons/communication/business';
import Link from 'material-ui/svg-icons/content/link';
import CommunicationPhone from 'material-ui/svg-icons/communication/phone';

const ContactInfo = ({address, url, phoneNumber, strippedNumber}) => (
  <Paper zDepth={2}>
    <List>
      <ListItem
        rightIcon={<CommunicationPhone color={indigo500}/>}
        primaryText="Phone Number"
        onTouchTap={(e) => window.open(`tel:${strippedNumber}`)}
        secondaryText={phoneNumber ? phoneNumber : 'Not Available'}
      />
      <Divider />
      <ListItem
        rightIcon={<Business color={indigo500}/>}
        primaryText="Address"
        onTouchTap={(e) => window.open(`https://www.google.com/maps/search/?api=1&query=${address}`)}
        secondaryText={address ? address : 'Not Available'}
        secondaryTextLines={2}
      />
      <Divider />
      <ListItem
        rightIcon={<Link color={indigo500}/>}
        primaryText="Website"
        onTouchTap={() => window.open(`${url}`)}
        secondaryText={url ? url : 'Not Available'}
      />
    </List>
  </Paper>
);

export default ContactInfo;