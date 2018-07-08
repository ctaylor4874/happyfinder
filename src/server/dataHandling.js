/**
 * Created by cody on 6/23/17.
 */
import axios from "axios";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

module.exports = {
  venuesQuery: (userLat, userLng, radius) =>
    `SELECT 
      id_,
      category,
      fs_venue_id,
      google_id,
      lat,
      lng,
      name,
      happy_hour_string,
      (acos(sin(lat * 0.0175) * sin(${userLat} * 0.0175) + cos(lat * 0.0175) * 
      cos(${userLat} * 0.0175) * cos((${userLng} * 0.0175) - (lng * 0.0175))) * 3959) 
      AS milesfromuser 
      FROM happyfinder 
      WHERE (acos(sin(lat * 0.0175) * sin(${userLat} * 0.0175) + cos(lat * 0.0175) * cos(${userLat} * 0.0175) * 
      cos((${userLng} * 0.0175) - (lng * 0.0175))) * 3959 <= ${radius}) 
      ORDER BY milesfromuser ASC 
      LIMIT 75;`,
  getData: url => {
    axios.get(url);
    return axios.get(url);
  },
  makeURL: userLocation => {
    return `https://maps.googleapis.com/maps/api/geocode/json?address=${userLocation}&key=${GOOGLE_API_KEY}`;
  },
  venueQuery: id_ =>
    `SELECT *
        FROM happyfinder 
        WHERE id_ = ${id_};`
};
