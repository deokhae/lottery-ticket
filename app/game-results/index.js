const NodeCache = require('node-cache');
const fetchData = require('./client');

const CACHE_KEY = 'GAME-RESULTS';
const REFRESH_RESULTS_EVERY_MINUTES = 60 * 60 * 1000;

const cache = new NodeCache({
  stdTTL: REFRESH_RESULTS_EVERY_MINUTES,
  deleteOnExpire: false,
  errorOnMissing: false
});

cache.on('expired', function () {
  if (!cacheGameResults()) {
    // TODO: Handle when this refresh fails. The 'expired' event will not re-occur.
    //       Data will then be stale until server restarts. Good example why this should be a job.
  }
});

async function cacheGameResults() {
  const gameResults = await fetchData();
  if (!gameResults) return null;

  await cache.set(CACHE_KEY, gameResults);
  return gameResults;
}

function getGameResults() {
  return cache.get(CACHE_KEY) || null;
}

module.exports = {
  initializeCache: cacheGameResults,
  fetch: getGameResults
};