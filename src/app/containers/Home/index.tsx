import * as React from 'react';
const {connect} = require('react-redux');
import { getSchedule } from 'schedule/actions'
import { browserHistory } from 'react-router';

import CircularProgress from 'material-ui/CircularProgress';

import pathFor from 'routes/utils/pathFor';

import { GetScheduleForm } from 'components/GetScheduleForm';
import { CenteredPaper } from 'components/CenteredPaper';


@connect(
  state => ({
    isFetching: state.schedule.isFetching,
    logMessage: state.schedule.logMessage,
  }),
)
class Home extends React.Component<any, any> {

  private onScheduleLoadRequest = ({url}) => {
    const {dispatch} = this.props;
    dispatch(getSchedule(url))
      .then(() => browserHistory.push(pathFor.SCHEDULE_EDIT));
  };

  public render() {
    const {isFetching, logMessage} = this.props;

    return (
        <CenteredPaper circle={true}>
          {
            isFetching ?
              <CircularProgress />
              :
              <GetScheduleForm onSubmit={this.onScheduleLoadRequest}/>
          }
          <p>{logMessage}</p>
        </CenteredPaper>
    );
  }
}

export { Home }
