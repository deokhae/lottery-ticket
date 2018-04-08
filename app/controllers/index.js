const {
  BadRequestError
} = require('../errors');

const {
  checkTicketService
} = require('../services');


function respondWithError(res, err) {
  if (err instanceof BadRequestError) {
    res.status(400)
    res.json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
}

// Hello World on '/'
function root(req, res) {
  res.json({ message: 'Hello World' });
}

// Check ticket POST '/check-ticket'
async function checkTicket(req, res) {
  try {
    const result = await checkTicketService(req);
    res.json(result);
  } catch (err) {
    respondWithError(res, err);
  }
}

// Simulate a Failure on '/fail'
function fail(req, res) {
  throw new Error('Hello Error');
}

// 404 Handler
function notFound(req, res) {
  const err = new Error('Not Found');
  err.status = 404;
  throw err;
}

module.exports = {
  root,
  checkTicket,
  fail,
  notFound
};
