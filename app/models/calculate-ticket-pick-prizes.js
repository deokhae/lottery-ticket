const GRAND_PRIZE_AMOUNT = 'GRAND_PRIZE';

const POWERBALL_PRIZES_BY_WHITEBALL_COUNT = {
  5: GRAND_PRIZE_AMOUNT,
  4: 50000,
  3: 100,
  2: 7,
  1: 4,
  0: 4
};

const WHITEBALL_ONLY_PRIZES_BY_COUNT = {
  5: 1000000,
  4: 100,
  3: 7
};

function calculatePrize(powerBallWon, winningWhiteBallsCount) {
  if (powerBallWon) return POWERBALL_PRIZES_BY_WHITEBALL_COUNT[winningWhiteBallsCount];
  return WHITEBALL_ONLY_PRIZES_BY_COUNT[winningWhiteBallsCount];
}

function calculateTicketPickPrizes(ticket, draw) {
  const drawnWhiteBallsSet = new Set(draw.whiteBalls);

  return ticket
    .picks
    .map((pick) => {
      const winningWhiteBalls = pick.whiteBalls.filter(whiteBall => drawnWhiteBallsSet.has(whiteBall));
      const winningPowerBall = pick.powerBall === draw.powerBall ? pick.powerBall : null;
      const powerBallWon = 0 < winningPowerBall;

      let prize = calculatePrize(powerBallWon, winningWhiteBalls.length);
      if (prize === GRAND_PRIZE_AMOUNT) {
        prize = draw.grandPrizeAmount;
      }

      return {
        won: !!prize,
        prize: prize,
        whiteBalls: 0 < winningWhiteBalls.length ? winningWhiteBalls : null,
        powerBall: winningPowerBall
      };
    });
}

module.exports = calculateTicketPickPrizes;