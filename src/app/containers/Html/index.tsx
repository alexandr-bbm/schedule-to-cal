import * as React from 'react';
import * as Helmet from 'react-helmet';

interface IHtmlProps {
  manifest?: Object;
  markup?: string;
  store?: any;
}

class Html extends React.Component<IHtmlProps, {}> {
  private resolve(files) {
    return files.map((src) => {
      if (!this.props.manifest[src]) {
        return;
      }
      return '/public/' + this.props.manifest[src];
    }).filter((file) => file !== undefined);
  }

  public render() {
    const head = Helmet.rewind();
    const {markup, store} = this.props;

    const styles = this.resolve([
      'vendor.css',
      'app.css'
    ]);
    styles.unshift('https://unpkg.com/tachyons/css/tachyons.min.css');
    const renderStyles = styles.map((src, i) =>
      <link key={i} rel="stylesheet" type="text/css" href={src}/>
    );

    const scripts = this.resolve([
      'vendor.js',
      'app.js'
    ]);
    scripts.unshift('https://apis.google.com/js/client.js');
    const renderScripts = scripts.map((src, i) =>
      <script src={src} key={i}/>
    );

    // tslint:disable-next-line:max-line-length
    const initialState = (
      <script dangerouslySetInnerHTML={{ __html: `window.__INITIAL_STATE__=${JSON.stringify(store.getState())};` }}
              charSet="UTF-8"/>);

    return (
      <html>
      <head>
        {head.base.toComponent()}
        {head.title.toComponent()}
        {head.meta.toComponent()}
        {head.link.toComponent()}
        {head.script.toComponent()}

        {renderStyles}
        <link rel="shortcut icon" href="//calendar.google.com/googlecalendar/images/favicon_v2014_14.ico"/>
      </head>
      <body>
      <main id="app" dangerouslySetInnerHTML={{ __html: markup }}/>
      {initialState}
      {renderScripts}
      </body>
      </html>
    );
  }
}

export { Html }
