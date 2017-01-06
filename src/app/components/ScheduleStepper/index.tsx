import * as React from 'react';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';

export const ScheduleStepper = ({stepIndex}) => {
  return (
    <div className="mb3 mt3">
      <Stepper activeStep={stepIndex}>
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
