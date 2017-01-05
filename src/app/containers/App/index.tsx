const appConfig = require('../../../../config/main');
import * as React from 'react';
import * as Helmet from 'react-helmet';
require('./style.css');
import { GithubRibbon } from 'components/GithubRibbon';


class App extends React.Component<any, any> {
  public render() {
    const s = require('./style.css');

    return (
      <section className={s.appContainer}>
        <Helmet {...appConfig.app} {...appConfig.app.head}/>
        {this.props.children}
        <GithubRibbon />
      </section>
    );
  }
}

export { App }
