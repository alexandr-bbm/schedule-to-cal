import * as React from 'react';
const {connect} = require('react-redux');
import { browserHistory, Link } from 'react-router';
import pathFor from 'routes/utils/pathFor';
import stepFor from 'helpers/stepFor';

import { deleteLesson, resetApp } from 'schedule/actions';

import { groupBy } from 'lodash';

import Toggle from 'material-ui/Toggle';
import { RaisedButton } from "material-ui";

import { CenteredPaper } from 'components/CenteredPaper';
import { ScheduleTable } from 'components/ScheduleTable';
import { ILesson } from "services/schedule/models";

const THS = [
  'Время',
  'Пн',
  'Вт',
  'Ср',
  'Чт',
  'Пт',
  'Сб',
];

const getLessonsByWeek = state => state.schedule.lessonsData && groupBy(state.schedule.lessonsData.lessons, 'weekIdx');

export const getLessonsForRender = (lessons: ILesson[]): Array<any[]> => {
  let out = [];
  const groupedByTime = groupBy(lessons, 'timeStart');
  const startTimes = Object.keys(groupedByTime);

  const rowsNum = startTimes.length;
  const colsNum = THS.length;

  for (let i = 0; i < rowsNum; i++) {
    out[i] = [];
    for (let j = 0; j < colsNum; j++) {
      if (j === 0) {
        out[i][j] = {text: startTimes[i]};
      } else {
        const lessonForDay = groupedByTime[startTimes[i]].find(l => l.dayIdx === j - 1);
        out[i][j] = lessonForDay
          ?
          {
            text: `${lessonForDay.subject} ${lessonForDay.lessonType}`,
            id: lessonForDay.id
          }
          :
          {text: ''};
      }
    }
  }

  return out;

};

@connect(
  state => ({
    lessonsByWeek: getLessonsByWeek(state),
  }),
)
class Schedule extends React.Component<any, any> {

  state = {
    deleteMode: true
  };

  onDeleteModeToggle = (event, value) => {
    this.setState({
      deleteMode: value
    })
  };

  onLessonDeleteRequest = id => this.props.dispatch(deleteLesson(id));

  onExitRequest = () => {
    browserHistory.push(pathFor.SCHEDULE_IMPORT);
  };

  onExitToIndexRequest = () => {
    this.props.dispatch(resetApp());
    browserHistory.push(pathFor.INDEX);
  };

  public render() {
    const {lessonsByWeek} = this.props;

    if (!lessonsByWeek) {
      return <CenteredPaper circle={true}>
          <p>Возникла ошибка</p>
          <div>
            <RaisedButton label="На главную" onTouchTap={this.onExitToIndexRequest} />
          </div>
        </CenteredPaper>
    }

    const firstWeekLessons = getLessonsForRender(lessonsByWeek[0]);
    const secondWeekLessons = getLessonsForRender(lessonsByWeek[1]);
    const {deleteMode} = this.state;

    const commonTableProps = {
      isDeleteMode: deleteMode,
      onDeleteRequest: this.onLessonDeleteRequest,
      tableHeaders: THS,
    };

    return (
      <div>
        <CenteredPaper width="900px" height="auto" padding="10px" className="mb3 mt3">
          <div className="dn" style={{width: '300px'}}>
            <Toggle label="Режим удаления" onToggle={this.onDeleteModeToggle}/>
          </div>
          <span className="mr3">Кликайте по парам, чтобы их удалить</span>
          <span>
            <RaisedButton label="Перейти к импорту" onTouchTap={this.onExitRequest} primary={true} />
          </span>
        </CenteredPaper>
        <CenteredPaper width="900px" height="auto" className="mb3 mt3">
          <ScheduleTable
            {...commonTableProps}
            lessonsForWeek={firstWeekLessons}
          />
        </CenteredPaper>
        <CenteredPaper width="900px" height="auto" className="mb3 mt3">
          <ScheduleTable
            {...commonTableProps}
            lessonsForWeek={secondWeekLessons}
          />
        </CenteredPaper>
      </div>
    );
  }
}

export { Schedule }
