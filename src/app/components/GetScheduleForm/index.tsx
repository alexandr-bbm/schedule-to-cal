import * as React from 'react';
import { reduxForm } from 'redux-form';
const Field = require('redux-form').Field;

import RaisedButton from 'material-ui/RaisedButton';
import { TextField } from 'redux-form-material-ui';

const required = value => value == null ? 'Обязательное поле' : undefined;
const startsWithUrl = value => value && value.startsWith('http://rasp.tpu.ru/') ? undefined :
  'Должно начинаться с http://rasp.tpu.ru/';

const COMMON_FIELDS_PROPS = {
  component: TextField,
  fullWidth: true,
  errorStyle: {float: "left"}
};

@reduxForm({
  form: 'contact',
  fields: [
    'url',
  ]
})
class GetScheduleForm extends React.Component<any, any> {
  public render() {
    return (
      <span>
        <form onSubmit={this.props.handleSubmit}>
            <Field
              {...COMMON_FIELDS_PROPS}
              name="url"
              floatingLabelText="URL-адрес расписания"
              hintText="Скопируйте из адресной строки"
              validate={[required, startsWithUrl]}
            />
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

export { GetScheduleForm }
