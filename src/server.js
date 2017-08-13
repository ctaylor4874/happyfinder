/**
 * Created by cody on 6/2/17.
 */
const handleDatabase = require('./db').handleDatabase;
const venueQuery = require('./dataHandling').venueQuery;
const getData = require('./dataHandling').getData;
const makeURL = require('./dataHandling').makeURL;
const venuesQuery = require('./dataHandling').venuesQuery;
const getMailOptions = require('./emailHandling').getMailOptions;
const transport = require('./emailHandling').transport;

const express = require('express');
const bodyParser = require('body-parser');
const escape = require('mysql').escape;

require("dotenv").config();

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Cache-Control", "no-cache");
  next();
});

const port = process.env.PORT || 3001;

router.post("/userLocation", (req, res) => {
  const userInfo = [];
  const userLocation = req.body.userLocation;
  const radius = req.body.radius || 5;
  const url = makeURL(userLocation);

  getData(url).then(
    response => {
      const latLng = response.data.results[0].geometry.location;
      userInfo.push({ latLng, userLocation, radius });
      handleDatabase(
        userInfo,
        venuesQuery(escape(latLng.lat), escape(latLng.lng), escape(radius)),
        res
      );
    },
    error => {
      console.log("There was an error getting the lat/lng of the user.");
      return error;
    }
  );
});
router.post("/send-mail", (req, res) => {
  const fromEmail = escape(req.body.fromEmail);
  const subject = escape(req.body.subject);
  const message = escape(req.body.message);
  const city = escape(req.body.city);
  const state = escape(req.body.state);
  const mailOptions = getMailOptions(fromEmail, subject, message, city, state);

  transport(mailOptions, res);
});

router.post("/venue-data", (req, res) => {
  const id = escape(req.body.id_);
  handleDatabase(null, venueQuery(id), res);
});

app.use("/api", router);

app.listen(port, () => {
  console.log(`Find the server at: http://localhost:${port}/`);
});
