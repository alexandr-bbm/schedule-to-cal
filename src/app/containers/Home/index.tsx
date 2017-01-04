import * as React from 'react';
const {connect} = require('react-redux');
import { getSchedule, authorizeGoogleCal, addScheduleToGoogleCal } from 'modules/schedule'

import CircularProgress from 'material-ui/CircularProgress';

import { GetScheduleForm } from 'components/GetScheduleForm';
import { RaisedButton } from "material-ui";
import { CenteredCircleLayout } from "components/CenteredCircleLayout/index";


@connect(
  state => ({
    isFetching: state.schedule.isFetching,
    isAuthorized: state.schedule.isAuthorized,
    logMessage: state.schedule.logMessage,
  }),
)
class Home extends React.Component<any, any> {

  private onScheduleRequest = ({url, calendarName}) => {
    const {dispatch} = this.props;

    dispatch(getSchedule(url))
      .then(() => dispatch(addScheduleToGoogleCal(calendarName)))
  };

  private onAuthRequest = () => {
    this.props.dispatch(authorizeGoogleCal())
  };


  public render() {
    const {isFetching, isAuthorized, logMessage} = this.props;

    return (
      <CenteredCircleLayout>
        {
          isFetching ?
            <CircularProgress />
            :
            isAuthorized ?
              <GetScheduleForm onSubmit={this.onScheduleRequest}/>
              :
              <div>
                <p>Сервис импортирует расписание ТПУ в Google Календарь.</p>
                <RaisedButton onTouchTap={this.onAuthRequest} label="ok"/>
              </div>
        }
        <p>{logMessage}</p>
      </CenteredCircleLayout>
    );
  }
}

export { Home }
