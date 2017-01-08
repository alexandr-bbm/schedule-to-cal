import { ILessonForRender } from "services/schedule/models";

export interface ILessonsByWeek {
  0: Array<ILessonForRender[]>,
  1?: Array<ILessonForRender[]>,
}

export interface IScheduleState {
  isFetching?: boolean;
  isAuthorized?: boolean;
  error?: boolean;
  lessonsByWeek?: ILessonsByWeek
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
    lessonsByWeek?: {
      0: Array<ILessonForRender[]>,
      1?: Array<ILessonForRender[]>,
    };
    id?: string
  };
}
