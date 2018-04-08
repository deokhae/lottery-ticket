const test = require('ava');
const td = require('testdouble');


const GAME_RESULTS_PATH = '../../../app/game-results';
const fetchData = td.replace(`${GAME_RESULTS_PATH}/client`);
const { initializeCache, fetch: fetchFromCache } = require(`${GAME_RESULTS_PATH}/index`);

test('Gets Game Results From Initialized Cache', async t => {
  td.when(fetchData({ onlyIfModified: true })).thenResolve({ data: 'some data' });
  await initializeCache();

  const gameResults = await fetchFromCache();

  t.deepEqual({ data: 'some data' }, gameResults);
});

test('Gets Null Game Results From Uninitialized Cache', async t => {
  const gameResults = await fetchFromCache();

  t.deepEqual(null, gameResults);
});