//////////////////////////////////////////////////////////////////
//
// TODO: This should really be a proper job
//
// TODO: This needs monitoring (a job would too!), especially watching for any failed API requests.
//

const NodeCache = require('node-cache');
const fetchData = require('./client');

const CACHE_KEY = 'GAME-RESULTS';

// TODO Move to config
const REFRESH_RESULTS_EVERY_SECONDS = 10;
const CHECK_EXPIRY_EVERY_SECONDS = 2;

const cache = new NodeCache({
  stdTTL: REFRESH_RESULTS_EVERY_SECONDS,
  checkperiod: CHECK_EXPIRY_EVERY_SECONDS,
  deleteOnExpire: false,
  errorOnMissing: false
});

// TODO: Disable this during tests. If they were longer lived it would interfere.
cache.on('expired', async function (key, currentGameResults) {
  if (key !== CACHE_KEY) return;

  console.log(`${key} has expired after ${REFRESH_RESULTS_EVERY_SECONDS} seconds. Fetching and caching an update.`);

  if (!await fetchAndSet()) {
    await cache.set(CACHE_KEY, currentGameResults);
  }
});

function formatDraw(draw) {
  const whiteBalls = draw
    .results
    .values
    .filter((value) => !value.name)
    .map((value) => parseInt(value.value));

  const powerBall = parseInt(
    draw
      .results
      .values
      .find((value) => value.name === 'Powerball')
      .value
  );

  const grandPrizeAmount = draw
    .prizes
    .values
    .find((value) => value.name === 'Jackpot')
    .value;

  return {
    date: draw.resultsAnnouncedAt.substring(0, 10),
    whiteBalls: whiteBalls,
    powerBall: powerBall,
    grandPrizeAmount: grandPrizeAmount
  };
}

function mapGameResultsToDrawsLookup(gameResults) {
  return gameResults
    .filter((draw) => draw.results)
    .map((draw) => formatDraw(draw))
    .reduce(
      (drawsLookup, draw) => {
        drawsLookup[draw.date] = draw;
        return drawsLookup;
      },
      {});
}

// TODO Optimize so that each draw can be retrieved individually, allowing for better scaling.
//      As is, the entire set of drawings are retrieved.
async function fetchAndSet() {
  const gameResults = await fetchData({ onlyIfModified: true });
  if (gameResults) {
    await cache.set(CACHE_KEY, mapGameResultsToDrawsLookup(gameResults));
  }

  return gameResults;
}

function fetchDraw(date) {
  const drawsLookup = cache.get(CACHE_KEY);
  if (!drawsLookup) return null;

  return drawsLookup[date];
}

module.exports = {
  initializeCache: fetchAndSet,
  fetchDraw
};