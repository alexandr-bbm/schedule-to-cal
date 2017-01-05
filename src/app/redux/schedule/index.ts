import { IScheduleState, IScheduleAction } from '../../models/schedule';
import * as a from './constants';
import {MOCK_DATA} from './mock';

/** Initial State */
const initialState: IScheduleState = {
  isFetching: false,
  isAuthorized: false,
  lessonsData: JSON.parse(MOCK_DATA),
};

/** Reducer */
export function scheduleReducer(state = initialState, action: IScheduleAction) {
  switch (action.type) {
    case a.GET_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case a.GET_SUCCESS:
      return {
        ...state,
        isFetching: false,
      };

    case a.SET:
      return {
        ...state,
        lessonsData: action.payload.lessonsData,
      };

    case a.CAL_AUTHORIZE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthorized: true,
      };

    case a.GET_FAILURE:
      return {
        ...state,
        isFetching: false,
        message: action.payload.message,
        error: true,
      };

    case a.SET_LOG_MESSAGE:
      return {
        ...state,
        logMessage: action.payload.logMessage
      };

    default:
      return state;
  }
}
