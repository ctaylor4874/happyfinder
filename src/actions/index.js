import axios from "axios";

export const GET_VENUES = "GET_VENUES";
export const ERROR = "ERROR";
export const IS_LOADING = "IS_LOADING";
export const SENT_EMAIL = "SENT_EMAIL";
export const VENUE_DATA = "VENUE_DATA";
export const SET_SELECTED_VENUE = "SET_SELECTED_VENUE";

function getAPIData(props) {
  const url = `/api/userLocation`;
  return axios.post(url, props);
}

export function getVenues(props) {
  return dispatch =>
    getAPIData(props).then(
      response => {
        dispatch({ type: GET_VENUES, payload: response });
      },
      error => {
        dispatch({ type: ERROR, payload: error.response });
      }
    );
}

function sendEmailData(props) {
  const url = `/api/send-mail`;
  return axios.post(url, props);
}

export function sendEmail(props) {
  return dispatch =>
    sendEmailData(props).then(
      response => {
        dispatch({ type: SENT_EMAIL, payload: response });
      },
      error => {
        dispatch({ type: ERROR, payload: error.response });
      }
    );
}

function _getVenueData(id_) {
  const url = `/api/venue-data`;
  return axios.post(url, { id_ });
}

export function getVenueData(id_) {
  return dispatch =>
    _getVenueData(id_).then(
      response => {
        dispatch({ type: VENUE_DATA, payload: response });
      },
      error => {
        dispatch({ type: ERROR, payload: error.response });
      }
    );
}

export function setSelectedVenue(venueId) {
  return { type: SET_SELECTED_VENUE, payload: venueId }
}
