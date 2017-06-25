/**
 * Created by cody on 5/31/17.
 */
import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

import {selectStyle, style, inputStyle} from '../styles/style';
import {renderTextField} from '../components/RenderTextField';
import {renderSelectField} from '../components/RenderSelectField';

class LocationSearch extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      redirect: false,
      userLocation: null,
      radius: null,
    };
  };

  onSubmit(props) {
    this.setState({
      redirect: true,
      userLocation: props.userLocation,
      radius: props.radius
    });
  };

  render() {
    const {handleSubmit, pristine, submitting} = this.props;
    const {redirect, userLocation, radius} = this.state;
    if (redirect) {
      return <Redirect to={`/happyhours/location/${userLocation}/${radius}`} push/>
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
            <MenuItem value={25} menuItemStyle={selectStyle} primaryText="25 miles"/>
            <MenuItem value={50} menuItemStyle={selectStyle} primaryText="50 miles"/>
          </Field>
        </div>
        <br/>
        <div>
          <Field
            name="userLocation"
            component={renderTextField}
            className="input-field"
            hintStyle={style}
            hintText="Location..."
            inputStyle={inputStyle}
          />
        </div>
        <div className="col-xs-12">
          <RaisedButton
            type="submit"
            label="Search"
            primary={true}
            disabled={pristine || submitting}
            className="button-style"
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

LocationSearch = connect(mapStateToProps, null)(LocationSearch);

export default LocationSearch;