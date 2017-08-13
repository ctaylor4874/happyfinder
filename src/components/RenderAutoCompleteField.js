/**
 * Created by cody on 6/26/17.
 */
import React from "react";
import AutoComplete from "material-ui/AutoComplete";

const renderAutoCompleteField = ({
  input,
  label,
  data,
  meta: { touched, error },
  children,
  ...custom
}) =>
  <AutoComplete
    filter={AutoComplete.caseInsensitiveFilter}
    hintText={label}
    dataSource={data}
    autoComplete="off"
    errorText={touched && error}
    {...input}
    {...custom}
  />;

export default renderAutoCompleteField;
