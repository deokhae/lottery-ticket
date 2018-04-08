const _ = require('lodash');
const Joi = require('joi');

const calculateTicketPickPrizes = require('../models/calculate-ticket-pick-prizes');
const { BadRequestError } = require('../errors');


// NOTE: The instructions are not clear that whiteballs are unique i.e. the result is a combination of 1 - 69 without any duplicates.
//       The powerball is chosen from a different set of 1 - 26 meaning the powerball may be the same as a chosen whiteball.
const whiteBallSchema = Joi
  .number()
  .integer()
  .min(1)
  .max(69)
  .required();

const whiteBallsSchema = Joi
  .array()
  .items(whiteBallSchema)
  .length(5)
  .unique()
  .required();

const powerBallSchema = Joi
  .number()
  .integer()
  .min(1)
  .max(26)
  .required();

const pickSchema = Joi
  .object()
  .keys({
    powerBall: powerBallSchema,
    whiteBalls: whiteBallsSchema
  });

const ticketSchema = Joi
  .object()
  .keys({
    picks: Joi
      .array()
      .items(pickSchema)
      .min(1)
      .required(),
    drawDate: Joi
      .date()
      .iso()
      .max('now')
      .required()
  });


async function getValidTicket(req) {
  try {
    return await Joi.validate(req.body, ticketSchema);
  } catch (err) {
    throw new BadRequestError(err);
  }
}

function assignPrizesToPicks(ticket, prizePicks) {
  prizePicks.forEach((prizePick, index) => {
    const {
      won = false,
      prize: amount = null,
      whiteBalls = null,
      powerBall = null
    } = prizePick;

    ticket
      .picks[index]
      .prize = { won, amount, whiteBalls, powerBall };
  });
}

// NOTE: Theoretically, someone could win the grand prize twice which would throw the math off.
function calculatePrizeTotal(ticket) {
  return ticket
    .picks
    .filter((pick) => pick.prize.won)
    .reduce((prizeTotal, pick) => prizeTotal + pick.prize.amount, 0);
}

async function checkTicketService(req) {
  const ticket = _.cloneDeep(await getValidTicket(req));
  ticket.summary = {
    prizeTotal: 0,
    errors: []
  };

  const prizePicks = calculateTicketPickPrizes(ticket);
  if (!prizePicks) {
    ticket.summary.errors.push({ drawDate: 'NOT_FOUND' });
    return ticket;
  }

  assignPrizesToPicks(ticket, prizePicks);
  ticket.summary.prizeTotal = calculatePrizeTotal(ticket);
  return ticket;
}

module.exports = checkTicketService;