const test = require('ava');
const deepFreeze = require('deep-freeze');
const moment = require('moment');
const td = require('testdouble');
const _ = require('lodash');

const { checkTicket } = require('../../../app/controllers');

const VALID_REQUEST_BODY = deepFreeze({
  'picks': [
    {
      'whiteBalls': [1, 2, 3, 4, 5],
      'powerBall': 1
    },
    {
      'whiteBalls': [1, 2, 1, 4, 5],
      'powerBall': 1
    }
  ],
  'drawDate': '2017-11-09'
});


// TODO stub out actual checks when they exist
test('Check Valid Ticket', async t => {
  const res = { json: td.function() };

  await checkTicket({ body: VALID_REQUEST_BODY }, res);

  t.notThrows(() =>
    td.verify(res.json({ message: 'Ticket Checked' }))
  );
});


////////////////////////////////////////////////////////
// 400 - BAD REQUEST

function request(block) {
  const reqBody = _.cloneDeep(VALID_REQUEST_BODY);
  block(reqBody);
  return { body: reqBody };
}

function expectErrorResponse(t, messageRegex) {
  return {
    json: function(body) { t.regex(body.error, messageRegex); },
    status: function(s) { t.is(400, s); }
  };
}

test('400s When Missing Picks', async t => {
  const req = request((body) => delete body.picks);

  await checkTicket(req, expectErrorResponse(t, /"picks" is required/));
});

test('400s When Insufficient Picks', async t => {
  const req = request((body) => body.picks = []);

  await checkTicket(req, expectErrorResponse(t, /"picks" must contain at least 1 items/));
});

test('400s With An Invalid Whiteball', async t => {
  const req = request((body) => body.picks[1].whiteBalls[2] = 'BAD NUMBER');

  await checkTicket(req, expectErrorResponse(t, /must be a number/));
});

test('400s With A Whiteball Below The Allowed Range (1 - 69)', async t => {
  const req = request((body) => body.picks[1].whiteBalls[2] = 0);

  await checkTicket(req, expectErrorResponse(t, /must be larger than or equal to 1/));
});

test('400s With A Whiteball Above The Allowed Range (1 - 69)', async t => {
  const req = request((body) => body.picks[1].whiteBalls[2] = 70);

  await checkTicket(req, expectErrorResponse(t, /must be less than or equal to 69/));
});

test('400s With Too Few Whiteballs', async t => {
  const req = request((body) => body.picks[1].whiteBalls.pop());

  await checkTicket(req, expectErrorResponse(t, /must contain 5 items/));
});

test('400s With Too Many Whiteballs', async t => {
  const req = request((body) => body.picks[1].whiteBalls.push(4));

  await checkTicket(req, expectErrorResponse(t, /must contain 5 items/));
});

test('400s With Missing Whiteballs', async t => {
  const req = request((body) => delete body.picks[1].whiteBalls);

  await checkTicket(req, expectErrorResponse(t, /"whiteBalls" is required/));
});

test('400s With A Powerball Below The Allowed Range (1 - 26)', async t => {
  const req = request((body) => body.picks[1].powerBall = 0);

  await checkTicket(req, expectErrorResponse(t, /must be larger than or equal to 1/));
});

test('400s With A Powerball Above The Allowed Range (1 - 26)', async t => {
  const req = request((body) => body.picks[1].powerBall = 27);

  await checkTicket(req, expectErrorResponse(t, /must be less than or equal to 26/));
});

test('400s An Invalid Powerball', async t => {
  const req = request((body) => body.picks[1].powerBall = 'BAD NUMBER');

  await checkTicket(req, expectErrorResponse(t, /must be a number/));
});

test('400s When Missing Powerball', async t => {
  const req = request((body) => delete body.picks[1].powerBall);

  await checkTicket(req, expectErrorResponse(t, /"powerBall" is required/));
});

test('400s When Missing Draw Date', async t => {
  const req = request((body) => delete body.drawDate);

  await checkTicket(req, expectErrorResponse(t, /"drawDate" is required/));
});

test('400s When Draw Date Is Invalid', async t => {
  const req = request((body) => body.drawDate = 'SOME BAD DATE');

  await checkTicket(req, expectErrorResponse(t, /"drawDate" must be a valid ISO 8601 date/));
});

test('400s When Draw Date Is In The Future', async t => {
  const req = request((body) => body.drawDate = moment().add(1, 'days').toDate());

  await checkTicket(req, expectErrorResponse(t, /"drawDate" must be less than or equal to/));
});

