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

class Items extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectHome: false,
    };
    this.onLinkTap = this.onLinkTap.bind(this);
  }

  onLinkTap() {
    this.setState({
      redirectHome: true,
    });
  }

  render() {
    const {redirectHome} = this.state;

    if (redirectHome) {
      this.setState({
        redirectHome: false,
      });
      return (
        <Redirect to="/" push/>
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
        <a className="mailto-link" href="mailto:cody.taylor@codybtaylor.com"><MenuItem primaryText="Contact Me"/></a>
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