const test = require('ava');
const td = require('testdouble');


const GAME_RESULTS_PATH = '../../../app/game-results';
const fetchData = td.replace(`${GAME_RESULTS_PATH}/client`);
const { initializeCache, fetchDraw } = require(`${GAME_RESULTS_PATH}/index`);

/* eslint ava/no-skip-test: 0 */

test.skip('Gets Game Results From Initialized Cache (FIX STATE CONFLICT w/ another test - NEED testdouble skills)', async t => {
  td.when(fetchData({ onlyIfModified: true })).thenResolve({ data: 'some data' });
  await initializeCache();

  const gameResults = await fetchDraw();

  t.deepEqual({ data: 'some data' }, gameResults);
});

test('Gets Null Game Results From Uninitialized Cache', async t => {
  const gameResults = await fetchDraw();

  t.deepEqual(null, gameResults);
});