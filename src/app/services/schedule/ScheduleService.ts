import { ILessonsData, ILesson, IGoogleCalEvent, ILessonForRender } from './models';
require('jquery');
require('./lib/jquery.xdomainajax.js');
const shortid = require('shortid');
import { groupBy } from 'lodash';

let instance = null;

/**
 * Класс-обертка для методов получения и обработки расписаний.
 */

class ScheduleService {

  private $grabbedDOM: JQuery;
  public lessonsData: ILessonsData;
  public TABLE_HEAD = [
    'Время',
    'Пн',
    'Вт',
    'Ср',
    'Чт',
    'Пт',
    'Сб',
  ];

  constructor() {
    if (!instance) {
      instance = this
    }
    return instance;
  }

  private fetchSchedule(url: string, DOMParser: ($dom: JQuery) => JQuery) {
    return new Promise((resolve) => {
      $.ajax({
        url: url,
        type: 'GET',
        success: function (data) {
          const $grabbedDOM = $($.parseHTML(data.responseText));
          const $scheduleTables = DOMParser($grabbedDOM);
          this.$grabbedDOM = $grabbedDOM;
          resolve($scheduleTables)
        }
      });
    })
  };

  private getTpuScheduleFromDOM($DOM: JQuery) {
    return $DOM.find('.c-table.schedule');
  }

  public fetchTPU(url: string) {
    return this.fetchSchedule(url, this.getTpuScheduleFromDOM);
  }

  public processTPU($scheduleTables: JQuery): ILessonsData {
    let lessons: ILesson[] = [];
    let startTimes: string[] = [];
    let currentDayFromSchedule = null;

    /** Получение моментов времени начала пар */
    $scheduleTables.find('.time').each(function () {
      startTimes.push($(this).text());
    });

    /** Перебираем все пары. Для каждой недели */
    $scheduleTables.each(function (idx) { //
      let weekIdx = idx;
      /** В каждой строке */
      $(this).find('tr').each(function (index) {
        /** это дни недели */
        if (index == 0) {
          /** Находим текущий день недели */
          $(this).find('th').each(function (dayIdx) {
            if ($(this).hasClass('current-day')) {
              currentDayFromSchedule = {
                weekIdx,
                dayIdx
              }
            }
          });
          return
        }
        /** Запоминаем индекс текущей строки (для времени) */
        let timeIndex = index;
        /** в каждом блоке */
        $(this).find('td').each(function (dayIdx) {
          /** первый пропускаем, т.к. это время */
          if (dayIdx == 0) return;
          /** находим див пары */
          let $subject = $(this).find('.subject');
          /** если такого нет (в пустых и в подгруппах) то выходим */
          if ($subject.length === 0) return;

          /** добавляем в массив пар очередную пару */
          lessons.push({
            subject: $(this).find('.subject').text(),
            title: $(this).find('.subject').attr('title'),
            lessonType: $(this).find('.lesson-type').text(),
            room: $(this).find('.room a').text(),
            teacher: $(this).find('.group-teacher').text().replace(/\\n\s+/, ''),
            timeStart: startTimes[timeIndex - 1],
            dayIdx: dayIdx - 1, // 0 - Пн, 1 - Вт и т.д.
            weekIdx: weekIdx, // 0 - нечет, 1 - чет
            duration: 95,
            id: shortid.generate()
          })
        })
      })
    });

    let startMonday = new Date();

    if (currentDayFromSchedule) {
      startMonday
        .setDate(startMonday.getDate() - currentDayFromSchedule.dayIdx + 1 - currentDayFromSchedule.weekIdx * 7);
    } else {
      /** Если текущего дня в расписании найдено не было (воскресение) */
      if (this.isCurrentWeekEven()) {
        startMonday.setDate(startMonday.getDate() + 1);
      } else {
        startMonday.setDate(startMonday.getDate() - 7);
      }
    }

    this.lessonsData = {
      lessons,
      isTwoWeeks: true,
      startMonday
    };

    return this.lessonsData;
  }

  /** Четная ли текущая неделя по версии рапсисания */
  private isCurrentWeekEven() {
    const odd = this.$grabbedDOM
      .find('.schedule-current-state').text()
      .split(',')
      .filter(c => c.includes('неделя'))[0]
      .includes('нечет');

    return !odd
  }

  public getCalEventsFromSchedule(schedule: ILessonsData): IGoogleCalEvent[] {
    return schedule.lessons.map(lesson => this.getCalEventFromLesson(lesson, schedule.startMonday))
  }

  public getCalEventFromLesson(lesson: ILesson, startMonday: Date): IGoogleCalEvent {
    const TIME_ZONE = 'Asia/Krasnoyarsk';
    const RECURRENCE = 'RRULE:FREQ=WEEKLY;INTERVAL=2';

    const evtName = lesson.subject + ' ' + lesson.lessonType + ' ' + lesson.room;

    let timeArr = lesson.timeStart.split(':');

    const evtStartDate = new Date(startMonday);
    evtStartDate.setDate(startMonday.getDate() + lesson.dayIdx + lesson.weekIdx * 7);
    evtStartDate.setHours(+timeArr[0]);
    evtStartDate.setMinutes(+timeArr[1]);

    const evtEndDate = new Date(evtStartDate.getTime() + lesson.duration * 60000);

    return {
      summary: evtName,
      start: {
        dateTime: evtStartDate.toISOString(),
        timeZone: TIME_ZONE
      },
      end: {
        dateTime: evtEndDate.toISOString(),
        timeZone: TIME_ZONE
      },
      recurrence: [RECURRENCE]
    }
  }

  public getLessonForRender(lesson: ILesson): ILessonForRender {
    const {timeStart, dayIdx, weekIdx, duration, id} = lesson;
    return {
      text: lesson.subject + ' ' + lesson.lessonType + ' ' + lesson.room,
      timeStart,
      dayIdx,
      weekIdx,
      duration,
      id,
    }
  }

  public getLessonsForRender(lessons: ILesson[]): ILessonForRender[] {
    return lessons.map(l => this.getLessonForRender(l));
  }

  /**
   * Преобразует данные в удобный для отображения таблицы вид.
   * @param lessons
   * @returns {Array} Двумерный массив для таблицы, включающий названия дней недели и времена начала пар.
   */
  public getLessonsTableArray(lessons: ILesson[]): Array<any[]> {
    // Проверка, что все переданные пары соответствуют одной неделе.
    const sameWeek = lessons.every(lesson => lesson.weekIdx === lessons[0].weekIdx);
    if (!sameWeek) {
      throw new Error('lessons must be of the same week');
    }

    let out = [];
    const groupedByTime = groupBy(this.getLessonsForRender(lessons), 'timeStart');
    const startTimes = Object.keys(groupedByTime);

    const rowsNum = startTimes.length;
    const colsNum = this.TABLE_HEAD.length;

    for (let i = 0; i < rowsNum; i++) {
      out[i] = [];
      for (let j = 0; j < colsNum; j++) {
        if (j === 0) {
          out[i][j] = {text: startTimes[i]}; // todo remove and implement in component.render()
        } else {
          const currentDayIdx = j - 1;
          const lessonForDay = groupedByTime[startTimes[i]].find(l => l.dayIdx === currentDayIdx);
          out[i][j] = lessonForDay
            ?
            lessonForDay
            :
            {
              text: '',
              timeStart: startTimes[i],
              dayIdx: currentDayIdx,
              weekIdx: lessons[0].weekIdx,
              duration: 95,
              id: shortid.generate(),
            };
        }
      }
    }
    return out;
  };
}

export default new ScheduleService();
