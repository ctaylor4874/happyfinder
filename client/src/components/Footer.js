/**
 * Created by cody on 6/22/17.
 */
import React, {Component} from 'react';
import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import Code from 'material-ui/svg-icons/action/code';

const codeIcon = <Code/>;
const favoritesIcon = <FontIcon className="material-icons">favorite</FontIcon>;
const nearbyIcon = <IconLocationOn />;

class Footer extends Component {
  state = {
    selectedIndex: 0,
  };

  select = (index) => this.setState({selectedIndex: index});

  render() {
    return (
      <Paper zDepth={1} className="footer">
        <BottomNavigation selectedIndex={this.state.selectedIndex}>
          <a id="contact-links" href="https://github.com/ctaylor4874" target="_blank">
            <BottomNavigationItem
              label="Visit My Github"
              icon={codeIcon}
            />
          </a>
          <a href="mailto:cody.taylor@codybtaylor.com" id="contact-links">
            <BottomNavigationItem
              label="Favorites"
              icon={favoritesIcon}
              onTouchTap={() => this.select(1)}
            />
          </a>
          <BottomNavigationItem
            label="Nearby"
            icon={nearbyIcon}
            onTouchTap={() => this.select(2)}
          />
        </BottomNavigation>
        <p>2017 &copy; All Rights Reserved.</p>
      </Paper>
    );
  }
}

export default Footer;