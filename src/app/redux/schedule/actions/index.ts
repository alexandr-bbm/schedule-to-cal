import { IScheduleAction } from 'models/schedule';
import scheduleService from 'services/schedule/ScheduleService'
import { ILessonsData } from "services/schedule/models";
import calendarAPIService from "services/schedule/CalendarAPIService";
import * as a from '../constants';
import { createAction } from 'redux-actions';
const root = require('window-or-global');

/** Fetch schedule from university website and saves it to store. */
export function getSchedule(url) {
  return dispatch => {
    dispatch(scheduleRequest());
    dispatch(scheduleSetLogMessage(`Загружаем расписание с ${url}`));
    return scheduleService.fetchTPU(url)
      .then($schedule => {
        scheduleService.processTPU($schedule as JQuery);
        dispatch(setSchedule(scheduleService.lessonsData));
        dispatch(scheduleSuccess());
        dispatch(scheduleSetLogMessage(''));
      })
      .catch(err => dispatch(scheduleFailure(err)));
  };
}

/** Uploads the lessons from store to google calendar.
 */
export const addScheduleToGoogleCal = (calendarName: string) => (dispatch, getState) => {
  dispatch(scheduleRequest());
  return calendarAPIService
    .addLessonsSchedule(calendarName, getState().schedule.lessonsData, msg => dispatch(scheduleSetLogMessage(msg)))
    .then(() => dispatch(scheduleSuccess()))
};

export function authorizeGoogleCal() {
  return dispatch => {
    return calendarAPIService
      .authorize()
      .then(() => dispatch({type: a.CAL_AUTHORIZE_SUCCESS}))
      .catch(err => dispatch(scheduleFailure(err)));
  }
}

/** Action Creator */
export const scheduleRequest = createAction(a.GET_REQUEST);

/** Action Creator */
export function scheduleSetLogMessage(logMessage: string): IScheduleAction {
  return {
    type: a.SET_LOG_MESSAGE,
    payload: {
      logMessage
    }
  };
}

/** Action Creator */
export function scheduleSuccess() {
  return {
    type: a.GET_SUCCESS,
  };

}/** Action Creator */

export function setSchedule(lessonsData: ILessonsData) {
  return {
    type: a.SET,
    payload: {
      lessonsData,
    },
  };
}

/** Action Creator */
export function scheduleFailure(message: any): IScheduleAction {
  return {
    type: a.GET_FAILURE,
    payload: {
      message,
    },
  };
}

export function deleteLesson(id: string) {
  return {
    type: a.DELETE_LESSON,
    payload: {
      id
    }
  }
}

export const setStepIndex = createAction(a.SET_STEP_INDEX);
export const resetApp = createAction(a.RESET);
