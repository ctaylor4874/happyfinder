/**
 * Created by cody on 5/31/17.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';

import RaisedButton from 'material-ui/RaisedButton';
import {renderTextField} from './RenderTextField'
import {getVenues} from '../actions/index';
import {style} from './style';

const buttonStyle = {
  margin: 12,
};

class LocationSearch extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(props) {
    this.props.getVenues(props)
  }

  render() {
    const {handleSubmit, pristine, submitting} = this.props;
    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <div className="col-xs-12">
          <Field
            name="userLocation"
            component={renderTextField}
            id="input-field"
            hintStyle={style}
            hintText="Enter a Location..."
          />
        </div>
        <div className="col-xs-12">
          <RaisedButton
            type="submit"
            label="Search"
            primary={true}
            disabled={pristine || submitting}
            style={buttonStyle}
          />
        </div>
      </form>
    )
  }
}

function validate(values) {
  const errors = {};
  if (!values.userLocation) {
    errors.userLocation = 'Enter a location...';
  }
  return errors;
}

function mapStateToProps(state) {
  return {
    errors: state.errors,
    isLoading: state.isLoading,
  }
}
LocationSearch = reduxForm({
  form: 'LocationSearchForm',
  validate
})(LocationSearch);

LocationSearch = connect(mapStateToProps, {
  getVenues,
})(LocationSearch);

export default LocationSearch;