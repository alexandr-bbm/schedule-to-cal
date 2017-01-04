import { ILessonsData, IGoogleCalEvent } from "./models";
import scheduleService from "./ScheduleService";
const root = require('window-or-global');

const CLIENT_ID = '120559952902-d3cg8l18j5nrmane86sil3m45nsj88qr.apps.googleusercontent.com';
const SECRET_KEY = 'ajPCWTbahf47NYPfVE0CRQA7';
const SCOPES = ["https://www.googleapis.com/auth/calendar"];

let instance = null;

class CalendarAPIService {

  isAuthorized: boolean;

  constructor () {
    if (!instance) {
      instance = this;
    }

    this.isAuthorized = false;

    return instance;
  }

  public authorize() {
    return new Promise(resolve => {
      root.gapi.auth.authorize(
        {
          client_id: CLIENT_ID,
          scope: SCOPES,
          immediate: false
        },
        authResult => {
          if (authResult && !authResult.error) {
            this.isAuthorized = true;
            root.gapi.client.load('calendar', 'v3', resolve);
          }
        });
    })
  }

  private addEventUnsafe(event: IGoogleCalEvent, calendarId: string = 'primary') {
    return new Promise ((resolve, reject) => {
      const request = root.gapi.client.calendar.events.insert({
        calendarId,
        'resource': event
      });
      request.execute(event => {
        if (event) {
          console.log(`${event.summary} was added`);
          resolve({event})
        } else {
          reject();
        }
      });

      // console.log(`Mock event ${Math.random()} was added`);
      // setTimeout(resolve, 200);
    })
  }

  private addCalendarUnsafe(calendarName: string = 'Расписание ТПУ') {
    return new Promise ((resolve) => {
      const request = root.gapi.client.calendar.calendars.insert({
        summary: calendarName
      });
      request.execute((calendar) => resolve({calendarId: calendar.id}));

/*      setTimeout(() => {
        resolve({calendarId: 'mockCalId'});
      }, 200)*/
    })
  }

  public addLessonsSchedule(calendarName: string, lessonsData: ILessonsData, logger: (message: string) => {}) {
    return new Promise (resolve => {
      logger('Создаем новый календарь для расписания.');
      this.addCalendarUnsafe(calendarName)
        .then(({calendarId}) => {
          logger(`Календарь ${calendarId} успешно создан.`);

          const events: IGoogleCalEvent[] = scheduleService.getCalEventsFromSchedule(lessonsData);

          let promiseChain = Promise.resolve(null);
          events.forEach(event => {
            promiseChain = promiseChain.then(() => {
              logger(`Добавляем ${event.summary}`);
              return this.addEventUnsafe(event, calendarId);
            });
          });
          promiseChain.then(resolve);
        })
    })
  }
}


export default new CalendarAPIService;
