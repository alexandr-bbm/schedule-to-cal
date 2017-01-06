import * as React from 'react';
import { IndexRoute, Route } from 'react-router';

import pathFor from 'routes/utils/pathFor';

import { App } from 'containers/base/App';
import { Home } from 'containers/Home';
import { Schedule } from 'containers/Schedule';
import { Import } from 'containers/Import';
import { Success } from 'containers/Success';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path={pathFor.SCHEDULE_EDIT} component={Schedule} />
    <Route path={pathFor.SCHEDULE_IMPORT} component={Import} />
    <Route path={pathFor.SCHEDULE_SUCCESS} component={Success} />
  </Route>
);
