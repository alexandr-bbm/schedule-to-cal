import * as React from 'react';
const {connect} = require('react-redux');
import { browserHistory } from 'react-router';
import pathFor from 'routes/utils/pathFor';

import { deleteLesson, resetApp } from 'schedule/actions';


import Toggle from 'material-ui/Toggle';
import { RaisedButton } from "material-ui";

import { CenteredPaper } from 'components/CenteredPaper';
import { ScheduleTable } from 'components/ScheduleTable';
import scheduleService from 'services/schedule/ScheduleService'


const THS = scheduleService.TABLE_HEAD;

@connect(
  state => ({
    lessonsByWeek: state.schedule.lessonsByWeek,
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
            lessonsForWeek={lessonsByWeek[0]}
          />
        </CenteredPaper>
        <CenteredPaper width="900px" height="auto" className="mb3 mt3">
          <ScheduleTable
            {...commonTableProps}
            lessonsForWeek={lessonsByWeek[1]}
          />
        </CenteredPaper>
      </div>
    );
  }
}

export { Schedule }
