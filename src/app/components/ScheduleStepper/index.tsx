import * as React from 'react';
import pathFor from 'routes/utils/pathFor'

import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';

const stepByRoute = {
  [pathFor.INDEX]: 0,
  [pathFor.SCHEDULE_EDIT]: 1,
  [pathFor.SCHEDULE_IMPORT]: 2,
  [pathFor.SCHEDULE_SUCCESS]: 3,
};

export const ScheduleStepper = ({route}) => {
  return (
    <div className="mb3 mt3">
      <Stepper activeStep={stepByRoute[route]}>
        <Step>
          <StepLabel>Загрузите расписание</StepLabel>
        </Step>
        <Step>
          <StepLabel>Удалите лишние пары</StepLabel>
        </Step>
        <Step>
          <StepLabel>Импортируйте в Google Calendar</StepLabel>
        </Step>
      </Stepper>
    </div>
  )
};
