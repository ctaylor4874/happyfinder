/**
 * Created by cody on 5/31/17.
 */
import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

import {selectStyle} from './style';
import {renderTextField} from './RenderTextField';
import {renderSelectField} from './RenderSelectField';
import {getVenues} from '../actions/index';
import {style} from './style';

const buttonStyle = {
  margin: 12,
};

class LocationSearch extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      redirect: false,
    }
  }

  onSubmit(props) {
    this.props.getVenues(props)
      .then(
        () => this.setState({redirect: true})
      );
  }

  render() {
    const {handleSubmit, pristine, submitting, userInfo} = this.props;
    const {redirect} = this.state;
    if (redirect) {
      console.log(userInfo);
      return <Redirect to={`/happyhours/${userInfo.userLocation}/${userInfo.radius}`}/>
    }
    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <h1 className="finder-text">Find Happy Hours</h1>
        <div className="col-xs-12">
          <Field
            name="radius"
            component={renderSelectField}
            label="Within..."
            id="select-field"
          >
            <MenuItem value={5} menuItemStyle={selectStyle} primaryText="5 miles"/>
            <MenuItem value={10} menuItemStyle={selectStyle} primaryText="10 miles"/>
            <MenuItem value={15} menuItemStyle={selectStyle} primaryText="15 miles"/>
            <MenuItem value={20} menuItemStyle={selectStyle} primaryText="20 miles"/>
            <MenuItem value={5000} menuItemStyle={selectStyle} primaryText="50+ miles"/>
          </Field>
        </div>
        <br/>
        <div className="col-xs-12">
          <Field
            name="userLocation"
            component={renderTextField}
            id="input-field"
            hintStyle={style}
            hintText="Location..."
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
  if (!values.radius) {
    errors.radius = 'Select a Radius...';
  }
  return errors;
}

function mapStateToProps(state) {
  return {
    errors: state.errors,
    isLoading: state.isLoading,
    userInfo: state.venues.userInfo,
    venues: state.venues.venues,
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