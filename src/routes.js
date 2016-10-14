import { App } from 'components';

module.exports = {
  path: '/',
  component: App,
  childRoutes: [
    require('./routes/Home'),
  ]
};
