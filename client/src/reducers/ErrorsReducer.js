/**
 * Created by cody on 6/1/17.
 */
import { ERROR } from '../actions/index';

const INITIAL_STATE = { errors: '' };

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case ERROR:
      return { ...state, errors: action.payload };
    default:
      return state;
  }
}
