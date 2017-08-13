/**
 * Created by cody on 6/1/17.
 */
import { IS_LOADING } from '../actions/index';

const INITIAL_STATE = { isLoading: false };

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case IS_LOADING:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}