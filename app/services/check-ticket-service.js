const Joi = require('joi');

const { BadRequestError } = require('../errors');


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
  } catch(err) {
    throw new BadRequestError(err);
  }
}

async function checkTicketService(req) {
  const ticket = await getValidTicket(req);
  return { message: 'Ticket Checked' };
}

module.exports = checkTicketService;