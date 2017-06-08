/**
 * Created by cody on 6/1/17.
 */
import { GET_VENUES } from '../actions/index';

const INITIAL_STATE = { venues: {} };

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_VENUES:
      return { ...state, venues: action.payload.data };
    default:
      return state;
  }
}