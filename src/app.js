import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import {syncHistoryWithStore, routerReducer} from 'react-router-redux';
import {reducer as formReducer} from 'redux-form';
import thunk from 'redux-thunk';

import * as reducers from 'redux/reducers';
import APIHandler from 'lib/api';
import config from './config.js';

global.API = new APIHandler(config);

const reducer = combineReducers({
  ...reducers,
  form: formReducer,
  routing: routerReducer
});

export const store = createStore(
  reducer,
  applyMiddleware(thunk),
);
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <div>
      <Router history={history} routes={require('./routes')} />
    </div>
  </Provider>,
  document.getElementById('mount')
);
