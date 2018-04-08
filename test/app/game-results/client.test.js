const test = require('ava');
const td = require('testdouble');


const axios = td.replace('axios');
const GAME_RESULTS_PATH = '../../../app/game-results';
const fetchGameResults = require(`${GAME_RESULTS_PATH}/client`);

test('Returns Game Results', async t => {
  td
    .when(axios.get('https://games.api.lottery.com/api/v2.0/results?game=59bc2b6031947b9daf338d32'))
    .thenResolve({ data: 'SOME JSON GAME RESULTS' });

  const gameResults = await fetchGameResults();

  t.is(gameResults, 'SOME JSON GAME RESULTS');
});

test('Returns Null On Error', async t => {
  td
    .when(axios.get)
    .thenReject(new Error('SOMETHING BAD HAPPENED'));

  const gameResults = await fetchGameResults({ log: false });

  t.is(gameResults, null);
});
