/**
 * Created by cody on 6/23/17.
 */
import { VENUE_DATA } from '../actions/index';

const INITIAL_STATE = { venueData: {} };

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case VENUE_DATA:
      console.log(action.payload.data)
      return { ...state, venueData: action.payload.data[0] };
    default:
      return state;
  }
}