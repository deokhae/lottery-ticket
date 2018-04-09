const { initializeCache } = require('../game-results');

async function initialize({ log = false } = {}) {
  log && console.log('Fetching and caching initial game results');

  const gameResults = await initializeCache();
  if (!gameResults) throw new Error('Unable to fetch and cache initial game results');

  if (log && process.env.NODE_ENV !== 'production') {
    console.log(`${JSON.stringify(gameResults, null, 2)}\n`);
  }

  return !gameResults;
}

module.exports = initialize;