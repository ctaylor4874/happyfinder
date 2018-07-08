/**
 * Created by cody on 6/2/17.
 */
import express from "express";
import bodyParser from "body-parser";
import { escape } from "mysql";
import path from "path";
import { handleDatabase } from "./db";
import { makeURL, getData, venuesQuery, venueQuery } from "./dataHandling";
import { getMailOptions, transport } from "./emailHandling";

require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/../build")));

const port = process.env.PORT || 5000;

app.post("/api/userLocation", (req, res) => {
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
      res.end();
      return error;
    }
  );
});
app.post("/api/send-mail", (req, res) => {
  const fromEmail = escape(req.body.fromEmail);
  const subject = escape(req.body.subject);
  const message = escape(req.body.message);
  const city = escape(req.body.city);
  const state = escape(req.body.state);
  const mailOptions = getMailOptions(fromEmail, subject, message, city, state);

  transport(mailOptions, res);
});

app.post("/api/venue-data", (req, res) => {
  const id = escape(req.body.id_);
  handleDatabase(null, venueQuery(id), res);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/../build/index.html"));
});

// app.use("/api", app);

app.listen(port, () => {
  console.log(`Find the server at: http://localhost:${port}/`);
});
