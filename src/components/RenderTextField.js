/**
 * Created by cody on 6/1/17.
 */
import React from "react";
import TextField from "material-ui/TextField";

const renderTextField = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) =>
  <TextField
    hintText={label}
    floatingLabelText={label}
    autoComplete="off"
    errorText={touched && error}
    {...input}
    {...custom}
  />;

export default renderTextField;
