import axios from 'axios';

export const GET_VENUES = 'GET_VENUES';
export const ERROR = 'ERROR';
export const IS_LOADING = 'IS_LOADING';

function getAPIData(props) {
  const url = `/api/${props.userLocation}/${props.radius}`;
  return axios.get(url);
}
export function getVenues(props) {
  return dispatch => getAPIData(props).then(
    (response) => {
      dispatch({type: GET_VENUES, payload: response});
    },
    (error) => {
      dispatch({type: ERROR, payload: error.response});
    },
  )
}
