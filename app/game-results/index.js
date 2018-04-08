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

async function fetchAndSet() {
  const gameResults = await fetchData({ onlyIfModified: true });
  if (gameResults) await cache.set(CACHE_KEY, gameResults);
  return gameResults;
}

function getGameResults() {
  return cache.get(CACHE_KEY) || null;
}

module.exports = {
  initializeCache: fetchAndSet,
  fetch: getGameResults
};