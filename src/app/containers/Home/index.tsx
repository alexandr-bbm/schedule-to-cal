import * as React from 'react';
const {connect} = require('react-redux');
import { getSchedule, authorizeGoogleCal, addScheduleToGoogleCal, setStepIndex } from 'schedule/actions'
import { Link, browserHistory } from 'react-router';

import CircularProgress from 'material-ui/CircularProgress';
import { RaisedButton } from "material-ui";

import pathFor from 'routes/utils/pathFor';
import stepFor from 'helpers/stepFor';

import { GetScheduleForm } from 'components/GetScheduleForm';
import { ImportScheduleForm } from 'components/ImportScheduleForm';
import { CenteredPaper } from 'components/CenteredPaper';
import { ScheduleStepper } from 'components/ScheduleStepper/index';


@connect(
  state => ({
    isFetching: state.schedule.isFetching,
    isAuthorized: state.schedule.isAuthorized,
    logMessage: state.schedule.logMessage,
    lessonsData: state.schedule.lessonsData,
    stepIndex: state.schedule.stepIndex,
  }),
)
class Home extends React.Component<any, any> {

  private onScheduleLoadRequest = ({url}) => {
    const {dispatch} = this.props;
    dispatch(getSchedule(url))
      .then(() => dispatch(setStepIndex(stepFor.EDIT_SCHEDULE)))
      .then(() => browserHistory.push(pathFor.SCHEDULE_EDIT));
      // .then(() => dispatch(addScheduleToGoogleCal(calendarName)))
  };

  private onScheduleImportRequest = ({calendarName}) => {
    const {dispatch} = this.props;
    dispatch(authorizeGoogleCal())
      .then(() => dispatch(addScheduleToGoogleCal(calendarName)))
      .then(() => dispatch(setStepIndex(stepFor.SUCCESS)))
  };

   private resetStepper = () => {
     this.props.dispatch(setStepIndex(stepFor.LOAD_SCHEDULE))
   };

  private getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return <GetScheduleForm onSubmit={this.onScheduleLoadRequest}/>;

      case 1:
        return <Link to={pathFor.SCHEDULE_EDIT}>
          <RaisedButton label="К расписанию"/>
        </Link>;

      case 2:
        return <ImportScheduleForm onSubmit={this.onScheduleImportRequest}/>;

      default:
        return <RaisedButton label="В начало" onTouchTap={this.resetStepper}/>;
    }
  };

  public render() {
    const {isFetching, logMessage, stepIndex} = this.props;

    return (
      <div>
        <ScheduleStepper stepIndex={stepIndex} />
        <CenteredPaper circle={true}>
          {
            isFetching ?
              <div>
                <CircularProgress />
              </div>
              :
              this.getStepContent(stepIndex)
          }
          <p>{logMessage}</p>
        </CenteredPaper>
      </div>
    );
  }
}

export { Home }
