const appConfig = require('../../../../../config/main');
import * as React from 'react';
import * as Helmet from 'react-helmet';
import { GithubRibbon } from 'components/GithubRibbon';
import { ScheduleStepper } from 'components/ScheduleStepper/index';
require('./style.css');

class App extends React.Component<any, any> {
  public render() {
    const s = require('./style.css');

    return (
      <section className={s.appContainer}>
        <Helmet {...appConfig.app} {...appConfig.app.head}/>
        <ScheduleStepper route={this.props.location.pathname} />
        {this.props.children}
        <GithubRibbon />
      </section>
    );
  }
}

export { App }
