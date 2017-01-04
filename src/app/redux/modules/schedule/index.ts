import { ISchedule, IScheduleAction } from 'models/schedule';
import scheduleService from './parser/ScheduleService'
import { ILessonsData } from "./parser/models";
import calendarAPIService from "modules/schedule/parser/CalendarAPIService";

/** Action Types */
export const GET_REQUEST: string = 'schedule/GET_REQUEST';
export const GET_SUCCESS: string = 'schedule/GET_SUCCESS';
export const GET_FAILURE: string = 'schedule/GET_FAILURE';
export const SET: string = 'schedule/SET';

export const SET_LOG_MESSAGE: string = 'schedule/SET_LOG_MESSAGE';
export const CAL_AUTHORIZE_SUCCESS: string = 'schedule/CAL_AUTHORIZE_SUCCESS';

/** Initial State */
const initialState: ISchedule = {
  isFetching: false,
  isAuthorized: false,
  lessonsData: null,
};

/** Reducer */
export function scheduleReducer(state = initialState, action: IScheduleAction) {
  switch (action.type) {
    case GET_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });

    case GET_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
      });

    case SET:
      return Object.assign({}, state, {
        lessonsData: action.payload.lessonsData,
      });

    case CAL_AUTHORIZE_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthorized: true,
      });

    case GET_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        message: action.payload.message,
        error: true,
      });

    case SET_LOG_MESSAGE:
      return {
        ...state,
        logMessage: action.payload.logMessage
      };

    default:
      return state;
  }
}

/** Async Action Creator */
/** Fetch schedule from university website and saves it to store. */
export function getSchedule(url) {
  return dispatch => {
    dispatch(scheduleRequest());
    dispatch(scheduleSetLogMessage(`Загружаем расписание с ${url}`));
    return scheduleService.fetchTPU(url)
      .then($schedule => {
        const lessonsData: ILessonsData = scheduleService.processTPU($schedule as JQuery);
        dispatch(scheduleSetLogMessage(`Расписание успешно загружено.`));
        dispatch(setSchedule(lessonsData));
      })
      .catch(err => dispatch(scheduleFailure(err)));
  };
}

/**
 *  Async action creator.
 *  Uploads the lessons from store to google calendar.
 */
export const addScheduleToGoogleCal = (calendarName: string) => (dispatch, getState) => {
  const {lessonsData} = getState().schedule;

  dispatch(scheduleSetLogMessage(`Начинаем добавлять расписание в Google Календарь`));
  calendarAPIService
    .addLessonsSchedule(calendarName, lessonsData, msg => dispatch(scheduleSetLogMessage(msg)))
    .then(() => {
      dispatch(scheduleSetLogMessage(`Расписание успешно загружено в ваш Google Календарь`));
      dispatch(scheduleSuccess());
    })
};

export function authorizeGoogleCal() {
  return dispatch => {
    calendarAPIService
      .authorize()
      .then(() => dispatch({type: CAL_AUTHORIZE_SUCCESS}))
      .catch(err => dispatch(scheduleFailure(err)));
  }
}

/** Action Creator */
export function scheduleRequest(): IScheduleAction {
  return {
    type: GET_REQUEST,
  };
}

/** Action Creator */
export function scheduleSetLogMessage(logMessage: string): IScheduleAction {
  return {
    type: SET_LOG_MESSAGE,
    payload: {
      logMessage
    }
  };
}

/** Action Creator */
export function scheduleSuccess() {
  return {
    type: GET_SUCCESS,
  };

}/** Action Creator */
export function setSchedule(lessonsData: ILessonsData) {
  return {
    type: SET,
    payload: {
      lessonsData,
    },
  };
}

/** Action Creator */
export function scheduleFailure(message: any): IScheduleAction {
  return {
    type: GET_FAILURE,
    payload: {
      message,
    },
  };
}
