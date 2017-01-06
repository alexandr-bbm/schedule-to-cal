import * as React from 'react';
import { IndexRoute, Route } from 'react-router';

import pathFor from 'routes/utils/pathFor';

import { App } from 'containers/App';
import { Home } from 'containers/Home';
import { Schedule } from 'containers/Schedule';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path={pathFor.SCHEDULE_EDIT} component={Schedule} />
  </Route>
);
