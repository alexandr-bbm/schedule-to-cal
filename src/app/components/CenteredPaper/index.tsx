import * as React from 'react';
import Paper from 'material-ui/Paper';
const s = require('./style.css');

export class CenteredPaper extends React.Component<any, any> {

  public render () {
    const paperStyle = {
      display: 'flex',
      alignItems: 'center',
      height: this.props.height || '400px',
      width: this.props.width || '400px',
      flexDirection: 'column',
    };
    return (
      <div className={`${s.centrify} ${this.props.className}`}>
        <Paper style={{...paperStyle, justifyContent: 'center'}} zDepth={3} circle={this.props.circle}>
          <div style={{padding: this.props.padding || `40px`}}>
            {this.props.children}
          </div>
        </Paper>
      </div>
    )
  }
};
