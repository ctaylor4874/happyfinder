/**
 * Created by cody on 6/2/17.
 */
import React from "react";
import SelectField from "material-ui/SelectField";

import { selectStyle } from "../styles/style";

const renderSelectField = ({
  input,
  label,
  meta: { touched, error },
  children,
  ...custom
}) =>
  <SelectField
    floatingLabelText={label}
    floatingLabelStyle={selectStyle}
    style={selectStyle}
    errorText={touched && error}
    {...input}
    onChange={(event, index, value) => input.onChange(value)}
    {...custom}
  >
    {children}
  </SelectField>;
export default renderSelectField;
