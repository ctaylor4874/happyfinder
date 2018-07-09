/**
 * Created by cody on 6/1/17.
 */
import {GET_VENUES, SET_SELECTED_VENUE} from "../actions/index";

const INITIAL_STATE = { venues: {}, userInfo: {}, selectedVenue: '' };

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_VENUES: {
      const userInfo = action.payload.data.pop()[0];
      return { ...state, venues: action.payload.data, userInfo };
    }
    case SET_SELECTED_VENUE: {
      return { ...state, selectedVenue: action.payload };
    }
    default:
      return state;
  }
}
