import * as React from 'react';
const {connect} = require('react-redux');
import { CenteredPaper } from 'components/CenteredPaper';
import { groupBy } from 'lodash';
import Toggle from 'material-ui/Toggle';

import { ScheduleTable } from 'components/ScheduleTable'

const getLessonsByWeek = state => state.schedule.lessonsData && groupBy(state.schedule.lessonsData.lessons, 'weekIdx');

@connect(
  state => ({
    lessonsByWeek: getLessonsByWeek(state)
  }),
)
class Schedule extends React.Component<any, any> {

  public render() {
    const {lessonsByWeek} = this.props;

    return (
      <div>
        <CenteredPaper width="900px" height="auto" padding="10px" className="mb3 mt3">
          <div style={{width: '300px'}}>
            <Toggle label="Режим удаления"/>
          </div>
        </CenteredPaper>
        <CenteredPaper width="900px" className="mb3 mt3">
          <ScheduleTable lessonsForWeek={lessonsByWeek[0]}/>
        </CenteredPaper>
        <CenteredPaper width="900px" className="mb3 mt3">
          <ScheduleTable lessonsForWeek={lessonsByWeek[1]}/>
        </CenteredPaper>
      </div>
    );
  }
}

export { Schedule }
