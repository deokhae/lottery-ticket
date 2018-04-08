const axios = require('axios');


const API = 'https://games.api.lottery.com/api/v2.0/results?game=59bc2b6031947b9daf338d32'; // TODO: Move to config
const ERROR = `Error calling ${API}`;
const STATUS_NOT_MODIFIED = 304;

const requestConfig = {
  headers: {
    Accept: 'application/json'
  },
  validateStatus: function (status) {
    return (200 <= status && status < 300) || status === STATUS_NOT_MODIFIED;
  }
};

function logErrors(err) {
  if (err.response) {
    // The request was made and the server responded with a status code that falls out of the range of 2xx
    console.warn(ERROR, err.response.data);
    console.warn(ERROR, err.response.status);
    console.warn(ERROR, err.response.headers);

  } else if (err.request) {

    // The request was made but no response was received. `error.request` is an instance of http.ClientRequest.
    console.warn(ERROR, err.request);

  } else {
    // Something happened in setting up the request that triggered an Error
    console.warn(ERROR, err.message);
  }

  console.warn(ERROR, err.config);
}

async function fetch({ onlyIfModified = false, log = true } = {}) {
  log && console.log(`Fetching game results from ${API} with ${JSON.stringify(requestConfig, null, 2)}`);

  try {
    const res = await axios.get(API, requestConfig);

    if (onlyIfModified) {
      requestConfig.headers['If-None-Match'] = res.headers.etag;
    }

    if (log) {
      res.status === STATUS_NOT_MODIFIED && console.log('No new game results found');
      res.status !== STATUS_NOT_MODIFIED && console.log('Fresh game results fetched');
    }

    return res.data;
  } catch (err) {
    log && logErrors(err);
    return null;
  }
}

module.exports = fetch;