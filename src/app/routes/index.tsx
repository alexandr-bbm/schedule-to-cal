import * as React from 'react';
import { IndexRoute, Route } from 'react-router';
import { App } from 'containers/App';
import { Home } from 'containers/Home';
import { Schedule } from 'containers/Schedule';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="schedule" component={Schedule} />
  </Route>
);
