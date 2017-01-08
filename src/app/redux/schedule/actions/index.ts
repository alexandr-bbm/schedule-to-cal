import { IScheduleAction } from 'models/schedule';
import scheduleService from 'services/schedule/ScheduleService'
import calendarAPIService from "services/schedule/CalendarAPIService";
import * as a from '../constants';
import { createAction } from 'redux-actions';
import { groupBy } from 'lodash';
const root = require('window-or-global');

/** Fetch schedule from university website and saves it to store. */
export function getSchedule(url) {
  return dispatch => {
    dispatch(scheduleRequest());
    dispatch(scheduleSetLogMessage(`Загружаем расписание с ${url}`));
    return scheduleService.fetchTPU(url)
      .then($schedule => {
        scheduleService.processTPU($schedule as JQuery);

        const lessonsByWeek = groupBy(scheduleService.lessonsData.lessons, 'weekIdx');

        dispatch(setSchedule({
          0: scheduleService.getLessonsTableArray(lessonsByWeek[0]),
          1: scheduleService.getLessonsTableArray(lessonsByWeek[1]),
        }));

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
    // fixme refactor
    .addLessonsSchedule(calendarName, getState().schedule.lessonsData, msg => dispatch(scheduleSetLogMessage(msg)))
    .then(() => dispatch(scheduleSuccess()))
    .catch(err => dispatch(scheduleFailure(err)));
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
export const setSchedule = createAction(a.SET);
