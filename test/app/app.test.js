const test = require('ava');

const app = require('../../app/app');

test('App Environment', t => {
  t.is(app.settings.env, 'test');
});

test('App Base Path', t => {
  t.is(app.mountpath, '/');
});

test('App Includes Error Handler Middleware', t => {
  const routes = app._router.stack.map(layer => layer.name);
  t.true(routes.includes('errorHandler'));
});

test('App Includes Middleware To Hide X-Powered-By Header', t => {
  const routes = app._router.stack.map(layer => layer.name);
  t.true(routes.includes('hidePoweredBy'));
});

test('App Includes JSON Parser Middleware', t => {
  const routes = app._router.stack.map(layer => layer.name);
  t.true(routes.includes('jsonParser'));
});

