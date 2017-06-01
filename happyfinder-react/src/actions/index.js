import axios from 'axios';

const ROOT_URL = 'http://maps.googleapis.com/maps/api/geocode/json?';

export function getAPI() {
  const url = `${ROOT_URL}address=${props.location}&key=${GOOGLE_KEY}`;
  return axios.get(url);
}
export default function getNurseData() {
  getAPI().then(
    (response) => {
      this.setState({ records: response.data.records });
    },
  );
}
