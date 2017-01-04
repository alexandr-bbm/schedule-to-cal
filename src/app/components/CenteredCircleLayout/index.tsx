import * as React from 'react';
import Paper from 'material-ui/Paper';
const s = require('./style.css');

const paperStyle = {
  display: 'flex',
  alignItems: 'center',
  height: '400px',
  width: '400px',
  flexDirection: 'column',
};

export class CenteredCircleLayout extends React.Component<any, any> {

  public render () {
    return (
      <div className={s.centrify}>
        <Paper style={{...paperStyle, justifyContent: 'center'}} zDepth={3} circle={true}>
          <div style={{padding: '40px'}}>
            {this.props.children}
          </div>
        </Paper>
      </div>
    )
  }
};
