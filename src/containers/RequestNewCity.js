/**
 * Created by cody on 6/26/17.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import {Redirect} from 'react-router-dom';

import {states} from '../components/States';
import RaisedButton from 'material-ui/RaisedButton';
import {sendEmail} from '../actions/index';
import {renderTextField} from '../components/RenderTextField';
import {renderAutoCompleteField} from '../components/RenderAutoCompleteField';
import {style, emailStyle} from '../styles/style';

class RequestNewCity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectHome: false,
      sendError: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
  };

  onSubmit(props) {
    this.props.sendEmail(props)
      .then(() => {
        if (this.props.emailResponse.responseCode) {
          this.setState({
            sendError: true,
          });
        } else {
          this.setState({
            redirectHome: true,
          });
        }
      });
  };

  render() {
    const {handleSubmit, pristine, submitting} = this.props;
    const {redirectHome, sendError} = this.state;

    if (sendError) {
      return (
        <div>
          <h2 id="email-error">Error Sending Email...</h2>
        </div>
      )
    }
    if (redirectHome) {
      alert('Request sent successfully! We will process within 24 hours.');
      return (
        <Redirect to="/"/>
      );
    }
    return (
      <form method="post" encType="text/plain"
            onSubmit={handleSubmit(this.onSubmit)}>
        <div className="col-xs-12">
          <div className="col-xs-12">
            <Field
              name="city"
              component={renderTextField}
              className="email-field"
              inputStyle={emailStyle}
              hintStyle={style}
              hintText="City"
            />
          </div>
          <div className="col-xs-12">
            <Field
            name="state"
            hintText="State"
            component={renderAutoCompleteField}
            inputStyle={emailStyle}
            hintStyle={style}
            className="states-autocomplete email-field"
            data={states}
            />
          </div>
          <div className="col-xs-12">
            <Field
              name="fromEmail"
              component={renderTextField}
              className="email-field"
              inputStyle={emailStyle}
              hintStyle={style}
              hintText="Your Email"
            />
          </div>
          <div className="col-xs-12">
            <Field
              name="message"
              component={renderTextField}
              multiLine={true}
              rows={5}
              className="email-field"
              textareaStyle={emailStyle}
              hintStyle={style}
              hintText="Message"
            />
          </div>
        </div>
        <div className="col-xs-12">
          <RaisedButton
            type="submit"
            label="Send"
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
  if (!values.fromEmail) {
    errors.fromEmail = 'Enter your email address...';
  }
  if (!values.city) {
    errors.city = 'Enter a city...';
  }
  if (!values.state) {
    errors.state = 'Enter a state...';
  }
  return errors;
}

function mapStateToProps(state) {
  return {
    emailResponse: state.emailResponse.emailResponse,
  }
}

RequestNewCity = reduxForm({
  form: 'RequestNewCityForm',
  validate
})(RequestNewCity);

RequestNewCity = connect(mapStateToProps, {
  sendEmail,
})(RequestNewCity);

export default RequestNewCity;