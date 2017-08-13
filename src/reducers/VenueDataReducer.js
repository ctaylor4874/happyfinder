/**
 * Created by cody on 6/23/17.
 */
import { VENUE_DATA } from '../actions/index';

const INITIAL_STATE = { venueData: {} };

const cleanHours = (s) => {
  s = JSON.parse("[" + s + "]")[0];
  return s
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case VENUE_DATA:
      const venueData = action.payload.data[0];
      venueData.strippedNumber = venueData.phone_number.replace(/\D/g,'');
      venueData.hours = cleanHours(venueData.hours);
      return { ...state, venueData: action.payload.data[0] };
    default:
      return state;
  }
}