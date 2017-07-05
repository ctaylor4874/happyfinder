/**
 * Created by cody on 6/2/17.
 */
require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import {escape} from 'mysql';

import {handleDatabase} from './db';
import {makeURL, getData, venuesQuery, venueQuery} from './dataHandling';
import {getMailOptions, transport} from './emailHandling';

const app = express();

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.set('port', (process.env.PORT || 3001));

app.post("/api", function (req, res) {
  let userInfo = [];
  let userLocation = req.body.userLocation;
  let radius = req.body.radius || 5;
  const url = makeURL(userLocation);

  getData(url)
    .then(
      (response) => {
        let latLng = response.data.results[0].geometry.location;
        userInfo.push({latLng, userLocation, radius});
        handleDatabase(userInfo, venuesQuery(escape(latLng.lat), escape(latLng.lng), escape(radius)), res)
      },
      (error) => {
        console.log("There was an error getting the lat/lng of the user.");
        return error;
      }
    );
});

app.post("/send-mail", (req, res) => {
  const fromEmail = escape(req.body.fromEmail),
    subject = escape(req.body.subject),
    message = escape(req.body.message),
    city = escape(req.body.city),
    state = escape(req.body.state);
  const mailOptions = getMailOptions(fromEmail, subject, message, city, state);

  transport(mailOptions, res);
});

app.post("/venue-data", (req, res) => {
  const id_ = escape(req.body.id_);
  handleDatabase(null, venueQuery(id_), res);
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});