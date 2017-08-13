/**
 * Created by cody on 6/2/17.
 */
"use strict";
require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import {escape} from 'mysql';

import {handleDatabase} from './db';
import {makeURL, getData, venuesQuery, venueQuery} from './dataHandling';
import {getMailOptions, transport} from './emailHandling';

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//To prevent errors from Cross Origin Resource Sharing, we will set
//our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
//and remove cacheing so we get the most recent comments
//   res.setHeader("Cache-Control", "no-cache");
  next();
});

// app.use(express.static('client/build'));
const port = process.env.PORT || 3001;
// app.set('port', (process.env.PORT || 3001));

router.post("/userLocation", function (req, res) {
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

router.post("/send-mail", (req, res) => {
  const fromEmail = escape(req.body.fromEmail),
    subject = escape(req.body.subject),
    message = escape(req.body.message),
    city = escape(req.body.city),
    state = escape(req.body.state);
  const mailOptions = getMailOptions(fromEmail, subject, message, city, state);

  transport(mailOptions, res);
});

router.post("/venue-data", (req, res) => {
  const id_ = escape(req.body.id_);
  handleDatabase(null, venueQuery(id_), res);
});

app.use("/api", router);

app.listen(port, () => {
  console.log(`Find the server at: http://localhost:${port}/`);
});