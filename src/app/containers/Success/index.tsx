import * as React from 'react';
const {connect} = require('react-redux');
import { resetApp } from 'schedule/actions';

import { browserHistory } from 'react-router';
import pathFor from 'routes/utils/pathFor'

import { RaisedButton } from "material-ui";
import { CenteredPaper } from 'components/CenteredPaper';


@connect()
class Success extends React.Component<any, any> {

   private handleAppReset = () => {
     browserHistory.push(pathFor.INDEX);
     this.props.dispatch(resetApp());
   };

  public render() {
    return (
        <CenteredPaper circle={true}>
          <RaisedButton label="В начало" onTouchTap={this.handleAppReset}/>
          <p>Расписание успешно загружено в ваш Google Календарь</p>
        </CenteredPaper>
    );
  }
}

export { Success }
