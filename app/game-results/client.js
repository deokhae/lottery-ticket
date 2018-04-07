// TODO Fetch real results
//      Promise linting error is fine for now since this is temporary.
function fetch() {
  return new Promise(resolve => setTimeout(resolve({ msg: 'Here are your game results' }), 3000));
}

module.exports = fetch;