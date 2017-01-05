import * as React from 'react';
const {connect} = require('react-redux');
import { getSchedule, authorizeGoogleCal, addScheduleToGoogleCal } from 'schedule/actions'
import { Link } from 'react-router';

import CircularProgress from 'material-ui/CircularProgress';
import { RaisedButton } from "material-ui";

import { GetScheduleForm } from 'components/GetScheduleForm';
import { CenteredPaper } from 'components/CenteredPaper';


@connect(
  state => ({
    isFetching: state.schedule.isFetching,
    isAuthorized: state.schedule.isAuthorized,
    logMessage: state.schedule.logMessage,
    lessonsData: state.schedule.lessonsData,
  }),
)
class Home extends React.Component<any, any> {

  private onScheduleRequest = ({url, calendarName}) => {
    const {dispatch} = this.props;

    dispatch(getSchedule(url));
      // .then(() => dispatch(addScheduleToGoogleCal(calendarName)))
  };

  private onAuthRequest = () => {
    this.props.dispatch(authorizeGoogleCal())
  };


  public render() {
    const {isFetching, isAuthorized, logMessage, lessonsData} = this.props;

    return (
      <CenteredPaper circle={true}>
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
        {lessonsData &&
          <Link to="schedule">
            <RaisedButton label="К расписанию"/>
          </Link>
        }
      </CenteredPaper>
    );
  }
}

export { Home }
