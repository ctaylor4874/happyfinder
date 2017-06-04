/**
 * Created by cody on 6/2/17.
 */
const mysql = require('mysql');
const express = require("express");
const axios = require('axios');

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const host = process.env.HAPPYFINDER_HOST;
const user = process.env.HAPPYFINDER_USER;
const password = process.env.HAPPYFINDER_PASSWORD;
const database = process.env.HAPPYFINDER_DATABASE;

const app = express();

app.set('port', (process.env.PORT || 3001));

const pool = mysql.createPool({
  connectionLimit: 100,
  host,
  user,
  password,
  database,
  debug: false
});

function handle_database(req, res) {
  pool.getConnection(function (err, connection) {
    if (err) {
      connection.release();
      res.json({"code": 100, "status": "Error in connection database"});
      return;
    }

    console.log('connected as id ' + connection.threadId);

    connection.query(req, function (err, rows) {
      connection.release();
      if (!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    });

    connection.on('error', function (err) {
      res.json({"code": 100, "status": "Error in connection database"});
    });
  });
}

const query = (userLat, userLng, radius) => (
  `SELECT *, 
  (acos(sin(lat * 0.0175) * sin(${userLat} * 0.0175) + cos(lat * 0.0175) * 
  cos(${userLat} * 0.0175) * cos((${userLng} * 0.0175) - (lng * 0.0175))) * 3959) 
  AS milesfromuser 
  FROM happyfinder 
  WHERE (acos(sin(lat * 0.0175) * sin(${userLat} * 0.0175) + cos(lat * 0.0175) * cos(${userLat} * 0.0175) * 
  cos((${userLng} * 0.0175) - (lng * 0.0175))) * 3959 <= ${radius}) 
  ORDER BY milesfromuser ASC 
  LIMIT 30;`
);

app.get("/api/:userLocation/:radius", function (req, res) {
  let userLocation = req.params.userLocation;
  let radius = req.params.radius || 20;
  getUserLatLng(userLocation)
    .then(
      (response) => {
        let latLng = response.data.results[0].geometry.location;
        handle_database(query(latLng.lat, latLng.lng, radius), res)
      },
      (error) => {
        console.log("There was an error getting the lat/lng of the user.");
        return error;
      }
    );
});

const getData = (url) => {
  axios.get(url);
  return axios.get(url);
};
const makeURL = (userLocation) => {
  return `https://maps.googleapis.com/maps/api/geocode/json?address=${userLocation}&key=${GOOGLE_API_KEY}`
};

const getUserLatLng = (userLocation) => {
  const url = makeURL(userLocation);
  return getData(url);
};

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});