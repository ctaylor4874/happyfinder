/**
 * Created by cody on 6/2/17.
 */
import express from 'express';
import bodyParser from 'body-parser';

import {handleDatabase} from './db';
import {makeURL, getData, venuesQuery, venueQuery} from './dataHandling';
import {getMailOptions, transport} from './emailHandling';

const app = express();

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.set('port', (process.env.PORT || 3001));

app.get("/api/:userLocation/:radius", function (req, res) {
  let userInfo = [];
  let userLocation = req.params.userLocation;
  let radius = req.params.radius || 5;

  const url = makeURL(userLocation);
  getData(url)
    .then(
      (response) => {
        let latLng = response.data.results[0].geometry.location;
        userInfo.push({latLng, userLocation, radius});
        handleDatabase(userInfo, venuesQuery(latLng.lat, latLng.lng, radius), res)
      },
      (error) => {
        console.log("There was an error getting the lat/lng of the user.");
        return error;
      }
    );
});

app.post("/send-mail", (req, res) => {
  const fromEmail = req.body.fromEmail,
    subject = req.body.subject,
    message = req.body.message,
    city = req.body.city,
    state = req.body.state;

  const mailOptions = getMailOptions(fromEmail, subject, message, city, state);
  transport(mailOptions, res);
});

app.post("/venue-data", (req, res) => {
  const id_ = req.body.id_;
  handleDatabase(null, venueQuery(id_), res);
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});