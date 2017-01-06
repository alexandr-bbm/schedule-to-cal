import * as React from 'react';
const {connect} = require('react-redux');
import { authorizeGoogleCal, addScheduleToGoogleCal } from 'schedule/actions'
import { browserHistory } from 'react-router';

import CircularProgress from 'material-ui/CircularProgress';

import pathFor from 'routes/utils/pathFor';

import { ImportScheduleForm } from 'components/ImportScheduleForm';
import { CenteredPaper } from 'components/CenteredPaper';


@connect(
  state => ({
    isFetching: state.schedule.isFetching,
    logMessage: state.schedule.logMessage,
  }),
)
class Import extends React.Component<any, any> {

  private onScheduleImportRequest = ({calendarName}) => {
    const {dispatch} = this.props;
    dispatch(authorizeGoogleCal())
      .then(() => dispatch(addScheduleToGoogleCal(calendarName)))
      .then(() => browserHistory.push(pathFor.SCHEDULE_SUCCESS))
  };


  public render() {
    const {isFetching, logMessage} = this.props;

    return (
        <CenteredPaper circle={true}>
          {
            isFetching ?
              <CircularProgress />
              :
              <ImportScheduleForm onSubmit={this.onScheduleImportRequest}/>
          }
          <p>{logMessage}</p>
        </CenteredPaper>
    );
  }
}

export { Import }
