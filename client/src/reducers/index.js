/**
 * Created by codytaylor on 5/23/17.
 */
import {combineReducers} from 'redux';
import { reducer as formReducer } from 'redux-form';

import venues from './VenuesReducer';
import isLoading from './LoadingReducer';
import errors from './ErrorsReducer';
import emailResponse from './EmailReducer';

const rootReducer = combineReducers({
  form: formReducer,
  venues,
  emailResponse,
  errors,
  isLoading,
});

export default rootReducer;
