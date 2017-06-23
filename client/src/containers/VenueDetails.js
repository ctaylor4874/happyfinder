/**
 * Created by cody on 6/23/17.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import DetailsCard from '../components/DetailsCard';
import {Card, CardTitle} from 'material-ui/Card';

import {getVenueData} from '../actions/index';

class VenueDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      venue: this.props.match.params.id_,
    };
  }

  componentWillMount() {
    this.props.getVenueData(this.state.venue);
  }

  render() {
    const {venueData} = this.props;
    return (
      <div>
        <Card>
          <CardTitle title={venueData.name} subtitle={venueData.category}/>
        </Card>
        <DetailsCard
        title="Website"
        data={venueData.url}
        />
        <DetailsCard
        title="Website"
        data={venueData.url}
        />
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