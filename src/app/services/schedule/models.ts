interface ILesson {
  subject: string;
  title: string;
  lessonType: string;
  room: string;
  teacher: string;
  timeStart: string;
  dayIdx: number;
  weekIdx: number;
  duration: number;
}

interface ILessonsData {
  lessons: ILesson[];
  isTwoWeeks: boolean;
  startMonday: Date;
}

interface IGoogleCalEvent {
  summary: string;
  start: {
    dateTime: string
    timeZone: string
  };
  end: {
    dateTime: string
    timeZone: string
  };
  recurrence?: string[]
}

export {ILesson, ILessonsData, IGoogleCalEvent}
