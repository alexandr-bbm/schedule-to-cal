import { IScheduleState, IScheduleAction } from '../../models/schedule';
import * as a from './constants';

/** Initial State */
const initialState: IScheduleState = {
  isFetching: false,
  isAuthorized: false,
  lessonsData: null,
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
