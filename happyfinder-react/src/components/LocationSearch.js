/**
 * Created by cody on 5/31/17.
 */
import React, {Component} from 'react';
import {Field} from 'redux-form';

import RenderRequiredField from './RenderField';

export default class LocationSearch extends Component{
  render() {
    const {handleSubmit, pristine, submitting} = this.props.props;
    const {onSubmit} = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="col-xs-12">
          <Field
            type="text"
            name="userLocation"
            component={RenderRequiredField}
            placeholder="Enter a location..."
          />
        </div>
        <div className="col-xs-12">
          <button
            type="submit"
            disabled={pristine || submitting}
            className="btn btn-primary form-control"
          >Search</button>
        </div>
      </form>
    )
  }
}