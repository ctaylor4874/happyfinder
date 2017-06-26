/**
 * Created by cody on 6/22/17.
 */
import React from 'react';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import Code from 'material-ui/svg-icons/action/code';
import Person from 'material-ui/svg-icons/social/person';
import Details from 'material-ui/svg-icons/image/details';

const codeIcon = <Code/>;
const personIcon = <Person />;
const detailsIcon = <Details />;

export const Footer = () => (
  <div className="footer">
    <Paper zDepth={1}>
      <BottomNavigation>
        <div className="col-xs-4">
          <a
            id="contact-links"
            href="https://github.com/ctaylor4874"
            target="_blank"
            rel="noopener noreferrer">
            <BottomNavigationItem
              label="Visit My Github"
              icon={codeIcon}
            />
          </a>
        </div>
        <div className="col-xs-4">
          <a
            id="contact-links"
            href="https://www.linkedin.com/in/cody-taylor"
            target="_blank"
            rel="noopener noreferrer">
            <BottomNavigationItem
              label="Visit My LinkedIn"
              icon={personIcon}
            />
          </a>
        </div>
        <div className="col-xs-4">
          <a
            id="contact-links"
            href="https://github.com/ctaylor4874/happyfinder"
            target="_blank"
            rel="noopener noreferrer">
            <BottomNavigationItem
              label="View Project Details"
              icon={detailsIcon}
            />
          </a>
        </div>
      </BottomNavigation>
      <p>2017 &copy; All Rights Reserved.</p>
    </Paper>
  </div>
);

export default Footer;