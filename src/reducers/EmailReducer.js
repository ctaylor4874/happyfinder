/**
 * Created by cody on 6/23/17.
 */

import { SENT_EMAIL } from "../actions/index";

const INITIAL_STATE = { emailResponse: "" };

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SENT_EMAIL:
      return { ...state, emailResponse: action.payload.data };
    default:
      return state;
  }
}
