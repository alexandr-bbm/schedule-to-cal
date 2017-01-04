// import * as e6p from 'es6-promise';
// (e6p as any).polyfill();
import 'isomorphic-fetch';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
const {Router, browserHistory} = require('react-router');
import {syncHistoryWithStore} from 'react-router-redux';
const {ReduxAsyncConnect} = require('redux-connect');
import {configureStore} from './app/redux/store';
import routes from './app/routes';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {MuiThemeProvider} from 'material-ui/styles';

const injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

const store = configureStore(
  browserHistory,
  window.__INITIAL_STATE__
);
const history = syncHistoryWithStore(browserHistory, store);
const connectedCmp = (props) => <ReduxAsyncConnect {...props} />;

ReactDOM.render(
  <Provider store={store} key="provider">
    <MuiThemeProvider muiTheme={getMuiTheme()}>
      <Router
        history={history}
        render={connectedCmp}
      >
        {routes}
      </Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('app')
);
