/**
 * Created by cody on 6/23/17.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';

import {sendEmail} from '../actions/index';
import {renderTextField} from '../components/RenderTextField';
import {reduxForm, Field} from 'redux-form';
import {style, emailStyle} from '../components/style';

class Email extends Component {
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
      alert('Email Sent Successfully!');
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
              name="fromEmail"
              component={renderTextField}
              className="email-field"
              inputStyle={emailStyle}
              hintStyle={style}
              hintText="Email..."
            />
          </div>
          <div className="col-xs-12">
            <Field
              name="subject"
              component={renderTextField}
              className="email-field"
              inputStyle={emailStyle}
              hintStyle={style}
              hintText="Subject..."
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
              hintText="Message..."
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
  if (!values.subject) {
    errors.subject = 'Enter a subject...';
  }
  if (!values.fromEmail) {
    errors.fromEmail = 'Enter your email address...';
  }
  if (!values.emailMessage) {
    errors.emailMessage = 'Enter a message...';
  }
  return errors;
}

function mapStateToProps(state) {
  return {
    emailResponse: state.emailResponse.emailResponse,
  }
}

Email = reduxForm({
  form: 'EmailForm',
  validate
})(Email);

Email = connect(mapStateToProps, {
  sendEmail,
})(Email);

export default Email;