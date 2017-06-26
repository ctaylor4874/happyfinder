/**
 * Created by cody on 6/23/17.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';

import ContactInfo from '../components/ContactInfo';
import VenueInfo from '../components/VenueInfo';
import Hours from '../components/HoursComponent';
import Loading from '../components/Loading';
import {getVenueData} from '../actions/index';

class VenueDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      height: null,
      venue: this.props.match.params.id_,
      venueLoaded: false,
    };
  }

  updateDimensions() {
    const height = window.innerHeight - 138;
    this.setState({height});
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillMount() {
    this.props.getVenueData(this.state.venue)
      .then(() => {
          this.setState({
            venueLoaded: true,
          });
          this.updateDimensions();
        }
      );
  }

  render() {
    const {venueLoaded} = this.state;
    const {venueData} = this.props;
    if (!(venueLoaded)) {
      return (
        <Loading/>
      )
    }
    return (
      <div style={{overflowY: 'scroll', height: this.state.height}}>
        <div className="col-xs-8 col-xs-offset-2 venue-details-div">
          <VenueInfo
            happyHourDetails={venueData.happy_hour_string}
            name={venueData.name}
            category={venueData.category}
            rating={venueData.rating}
            price={venueData.price}
          />
        </div>
        <div className="col-xs-8 col-xs-offset-2 venue-details-div">
          <ContactInfo
            phoneNumber={venueData.phone_number}
            strippedNumber={venueData.strippedNumber}
            url={venueData.url}
            address={venueData.address}
          />
        </div>
        <div className="col-xs-8 col-xs-offset-2 venue-details-div">
          <Hours
            hours={venueData.hours}
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    errors: state.errors,
    venueData: state.venueData.venueData,
  }
}

export default connect(mapStateToProps, {getVenueData})(VenueDetails)