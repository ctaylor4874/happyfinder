/**
 * Created by cody on 6/22/17.
 */
import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Divider from 'material-ui/Divider';

class Items extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectHome: false,
      routeContact: false,
    };
    this.onLinkTap = this.onLinkTap.bind(this);
    this.onContactTap = this.onContactTap.bind(this);
  }

  componentWillReceiveProps(){
    this.setState({
      redirectHome: false,
      routeContact: false,
    })
  }

  onLinkTap() {
    this.setState({
      redirectHome: true,
    });
  }
  onContactTap() {
    this.setState({
      routeContact: true,
    });
  }

  render() {
    const {redirectHome, routeContact} = this.state;

    if (redirectHome) {
      return (
        <Redirect to="/" push />
      )
    }
    if (routeContact) {
      return (
        <Redirect to="/contact" push />
      )
    }
    return (
      <IconMenu
        iconButtonElement={
          <IconButton><MoreVertIcon /></IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >

        <MenuItem primaryText="Back to Home" onTouchTap={this.onLinkTap.bind(this)}/>
        <Divider/>
        <MenuItem primaryText="Contact Me" onTouchTap={this.onContactTap.bind(this)} />
      </IconMenu>
    )
  }
}
Items.muiName = 'IconMenu';

const MenuBar = () => (
  <AppBar
    title="HappyFinder!"
    iconClassNameRight="muidocs-icon-navigation-expand-more"
    iconElementLeft={<Items />}
  />
);

export default MenuBar;