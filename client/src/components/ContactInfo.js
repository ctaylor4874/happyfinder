/**
 * Created by cody on 6/23/17.
 */
import React from 'react';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import CommunicationCall from 'material-ui/svg-icons/communication/call';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import {indigo500} from 'material-ui/styles/colors';
import CommunicationEmail from 'material-ui/svg-icons/communication/email';

const DetailsCard = ({title, data, phone_number}) => (
  <Paper zDepth={2}>
    <List>
      <ListItem
        rightIcon={<CommunicationEmail color={indigo500}/>}
        primaryText="Website"
        secondaryText={url}
      />
    </List>
    <Divider inset={true}/>
    <List>
      <ListItem
        rightIcon={<CommunicationCall color={indigo500}/>}
        primaryText="Phone Number"
        secondaryText={phone_number ? phone_number : 'Not Available'}
      />

      <ListItem
        insetChildren={true}
        primaryText="ali_connors@example.com"
        secondaryText="Work"
      />
    </List>
  </Paper>
);

export default DetailsCard;