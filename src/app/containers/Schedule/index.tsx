import * as React from 'react';
const {connect} = require('react-redux');

import { deleteLesson } from 'schedule/actions';

import { groupBy } from 'lodash';

import Toggle from 'material-ui/Toggle';

import { CenteredPaper } from 'components/CenteredPaper';
import { ScheduleTable } from 'components/ScheduleTable';

const getLessonsByWeek = state => state.schedule.lessonsData && groupBy(state.schedule.lessonsData.lessons, 'weekIdx');

@connect(
  state => ({
    lessonsByWeek: getLessonsByWeek(state)
  }),
)
class Schedule extends React.Component<any, any> {

  state = {
    deleteMode: false
  };

  onDeleteModeToggle = value => {
    this.setState({
      deleteMode: value
    })
  };

  onLessonDeleteRequest = id => {
    this.props.dispatch(deleteLesson(id));
  };

  public render() {
    const {lessonsByWeek} = this.props;
    const {deleteMode} = this.state;

    return (
      <div>
        <CenteredPaper width="900px" height="auto" padding="10px" className="mb3 mt3">
          <div style={{width: '300px'}}>
            <Toggle label="Режим удаления" onToggle={this.onDeleteModeToggle}/>
          </div>
        </CenteredPaper>
        <CenteredPaper width="900px" className="mb3 mt3">
          <ScheduleTable
            lessonsForWeek={lessonsByWeek[0]}
            isDeleteMode={deleteMode}
            onDeleteRequest={this.onLessonDeleteRequest}
          />
        </CenteredPaper>
        <CenteredPaper width="900px" className="mb3 mt3">
          <ScheduleTable
            lessonsForWeek={lessonsByWeek[1]}
            isDeleteMode={deleteMode}
            onDeleteRequest={this.onLessonDeleteRequest}
          />
        </CenteredPaper>
      </div>
    );
  }
}

export { Schedule }
