import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { scheduleReducer } from './modules/schedule';
import { reducer as formReducer } from 'redux-form';

const { reducer } = require('redux-connect');

const rootReducer = combineReducers({
  routing: routerReducer,
  schedule: scheduleReducer,
  form: formReducer,
  reduxAsyncConnect: reducer,
});

export default rootReducer;
