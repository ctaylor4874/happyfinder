import axios from 'axios';

export const GET_VENUES = 'GET_VENUES';
export const ERROR = 'ERROR';
export const IS_LOADING = 'IS_LOADING';
const ROOT_URL = 'http://localhost:3001';

function getAPIData(props) {
  console.log(props);
  const url = `${ROOT_URL}/venues?address=${props.userLocation}`;
  return axios.get(url);
}
export function getVenues(props) {
  console.log(props)
  return dispatch => getAPIData(props).then(
    (response) => {
      dispatch({type: GET_VENUES, payload: response});
    },
    (error) => {
      dispatch({type: ERROR, payload: error.response});
    },
  )
}
