/**
 * Created by cody on 6/1/17.
 */
import { GET_VENUES } from '../actions/index';

const INITIAL_STATE = { venues: {}, userInfo: {} };

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_VENUES:
      let userInfo = action.payload.data.pop()[0];
      console.log(userInfo)
      return { ...state, venues: action.payload.data, userInfo };
    default:
      return state;
  }
}