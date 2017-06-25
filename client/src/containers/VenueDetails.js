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
      venue: this.props.match.params.id_,
      venueLoaded: false,
    };
  }

  componentWillMount() {
    this.props.getVenueData(this.state.venue)
      .then(() =>
        this.setState({
          venueLoaded: true,
        })
      );
  }

  render() {
    const {venueLoaded} = this.state;
    const {venueData} = this.props;
    console.log(venueData)
    if (!(venueLoaded)){
      return(
        <Loading/>
      )
    }
    return (
      <div>
        <div className="col-sm-4 col-xs-4 col-xs-offset-2 venue-details-div">
          <VenueInfo
            happyHourDetails={venueData.happy_hour_string}
            name={venueData.name}
            category={venueData.category}
            rating={venueData.rating}
            price={venueData.price}
          />
        </div>
        <div className="col-sm-4 col-xs-4 venue-details-div">
          <ContactInfo
            phoneNumber={venueData.phone_number}
            strippedNumber={venueData.strippedNumber}
            url={venueData.url}
            address={venueData.address}
          />
        </div>
        <div className="col-sm-4 col-xs-8 col-xs-offset-2 venue-details-div">
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