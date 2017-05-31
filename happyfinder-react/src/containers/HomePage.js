/**
 * Created by cody on 5/31/17.
 */
import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import LocationSearch from '../components/LocationSearch'


class HomePage extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
        console.log('submitted');
  }

  render() {
    return(
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <LocationSearch {...this} />
          </div>
        </div>
      </div>
    )
  }
}

HomePage = reduxForm({
  form: 'HomePage',
})(HomePage);

export default HomePage;