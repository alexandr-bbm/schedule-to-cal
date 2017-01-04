import { ILessonsData } from "modules/schedule/parser/models";

/** Type Definitions */
export interface ISchedule {
  isFetching?: boolean;
  isAuthorized?: boolean;
  error?: boolean;
  lessonsData?: ILessonsData;
  message?: any;
  logMessage?: any;
}

export interface IScheduleAction {
  type: string;
  payload?: {
    count?: number;
    message?: any;
    logMessage?: any;
    lessonsData?: ILessonsData
  };
}
