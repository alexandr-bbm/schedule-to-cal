import { IScheduleState, IScheduleAction } from '../../models/schedule';
import * as a from './constants';

/** Initial State */
const initialState: IScheduleState = {
  isFetching: false,
  isAuthorized: false,
  lessonsByWeek: null,
  stepIndex: 0,
  logMessage: null
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
        lessonsByWeek: action.payload,
      };

    case a.RESET:
      return initialState;

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

    // case a.DELETE_LESSON:
    //   // const newLessons = state.lessons.filter(lesson => lesson.id !== action.payload.id);
    //   return {
    //     ...state,
    //     lessons: {
    //       ...state.lessons,
    //       lessons: newLessons
    //     }
    //   };

    case a.SET_STEP_INDEX:
      return {
        ...state,
        stepIndex: action.payload
      };

    default:
      return state;
  }
}
