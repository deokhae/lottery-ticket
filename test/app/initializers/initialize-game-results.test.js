const test = require('ava');
const td = require('testdouble');

const APP_PATH = '../../../app';
const { initializeCache } = td.replace(`${APP_PATH}/game-results`);
const initialize = require(`${APP_PATH}/initializers`).initializeGameResults;


test('Initializes Games Results Cache', async t => {
  td.when(initializeCache()).thenResolve({ gameResults: 'SOME RESULTS' });

  t.truthy(await initialize());
});

test('Inability To Initialize Games Results Cache Throws Error', async t => {
  td.when(initializeCache()).thenResolve(null);

  // WHAT IS AVA'S IDIOMATIC PATTERN FOR VERIFYING EXCEPTIONS ARE THROWN?
  // I cannot seem to get t.throws to work
  try {
    await initialize();
  } catch (err) {
    t.is(err.message, 'Unable to fetch and cache initial game results');
    return;
  }

  t.true(false, 'Should never get here');
});