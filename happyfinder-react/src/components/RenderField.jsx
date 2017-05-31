/**
 * Created by cody on 4/20/17.
 */
import React from 'react';

const renderRequiredField = field => (
  <div style={{ marginBottom: 10 }}>
    <input
      placeholder={field.placeholder}
      autoComplete="off"
      type={field.type}
      className="form-control"
      {...field.input}
    />
  </div>
);

export default renderRequiredField;
