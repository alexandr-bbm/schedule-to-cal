import { IScheduleAction } from 'models/schedule';
import scheduleService from 'services/schedule/ScheduleService'
import { ILessonsData } from "services/schedule/models";
import calendarAPIService from "services/schedule/CalendarAPIService";
import * as a from '../constants';

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

/** Uploads the lessons from store to google calendar. */
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
      .then(() => dispatch({type: a.CAL_AUTHORIZE_SUCCESS}))
      .catch(err => dispatch(scheduleFailure(err)));
  }
}

/** Action Creator */
export function scheduleRequest(): IScheduleAction {
  return {
    type: a.GET_REQUEST,
  };
}

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
