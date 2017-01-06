import * as React from 'react';
import { reduxForm } from 'redux-form';
const Field = require('redux-form').Field;

import RaisedButton from 'material-ui/RaisedButton';
import { TextField } from 'redux-form-material-ui';

const required = value => value == null ? 'Обязательное поле' : undefined;

const COMMON_FIELDS_PROPS = {
  component: TextField,
  fullWidth: true,
  errorStyle: {float: "left"}
};

@reduxForm({
  form: 'importSchedule',
  fields: [
    'url',
  ]
})
class ImportScheduleForm extends React.Component<any, any> {
  public render() {
    return (
      <span>
        <form onSubmit={this.props.handleSubmit}>
            <Field
              {...COMMON_FIELDS_PROPS}
              name="calendarName"
              floatingLabelText="Имя для календаря"
              hintText="Например: Расписание ТПУ"
              validate={required}
            />
          <div className="mt3">
            <RaisedButton type="submit" label="Импортировать"/>
          </div>
        </form>

      </span>
    );
  }
}

export { ImportScheduleForm }
