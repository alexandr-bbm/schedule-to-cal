import { ILessonsData } from "services/schedule/models";

export interface IScheduleState {
  isFetching?: boolean;
  isAuthorized?: boolean;
  error?: boolean;
  lessonsData?: ILessonsData;
  message?: any;
  logMessage?: any;
  stepIndex?: number
}

export interface IScheduleAction {
  type: string;
  payload?: {
    count?: number;
    message?: any;
    logMessage?: any;
    lessonsData?: ILessonsData
    id?: string
  };
}
