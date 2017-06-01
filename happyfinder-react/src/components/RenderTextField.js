/**
 * Created by cody on 6/1/17.
 */
import React from 'react';
import TextField from 'material-ui/TextField';

export const renderTextField = ({input, label, meta: {touched, error}, ...custom}) => (
  <TextField
    hintText={label}
    floatingLabelText={label}
    errorText={touched && error}
    multiLine={true}
    rows={4}
    rowsMax={4}
    {...input}
    {...custom}
  />
);