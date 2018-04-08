const test = require('ava');
const axios = require('axios');
const AxiosMockAdapter = require('axios-mock-adapter');


const GAME_RESULTS_PATH = '../../../app/game-results';
const fetchGameResults = require(`${GAME_RESULTS_PATH}/client`);

function axioGet() {
  return  (new AxiosMockAdapter(axios)).onGet('https://games.api.lottery.com/api/v2.0/results?game=59bc2b6031947b9daf338d32');
}

test('Returns Game Results On 200 - OK', async t => {
  axioGet().reply(200, { data: 'SOME JSON GAME RESULTS' });

  const gameResults = await fetchGameResults({ log: false });

  t.is(gameResults.data, 'SOME JSON GAME RESULTS');
});

test('Returns Null On 304 - Not Modified (using etag)', async t => {
  axioGet().reply(304);

  const gameResults = await fetchGameResults({ onlyIfModified: true, log: false });

  t.is(gameResults, null);
});

test('Returns Null On Error', async t => {
  axioGet().reply(500, { data: 'SOME JSON GAME RESULTS' });

  const gameResults = await fetchGameResults({ log: false });

  t.is(gameResults, null);
});

test('Returns Null On Timeout', async t => {
  axioGet().timeout();

  const gameResults = await fetchGameResults({ log: false });

  t.is(gameResults, null);
});

test('Returns Null On Network Timeout', async t => {
  axioGet().networkError();

  const gameResults = await fetchGameResults({ log: false });

  t.is(gameResults, null);
});
