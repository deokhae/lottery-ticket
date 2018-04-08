function getGameResultsForDrawDate(drawDate) {
  return 'TODO';
}

function calculateTicketPickPrizes(ticket) {
  const gameResults = getGameResultsForDrawDate(ticket.drawDate);
  if (!gameResults) {
    return null;
  }

  // TODO replace mocked implementation
  return [
    {
      won: false
    },
    {
      won: true,
      prize: 20,
      whiteBalls: [1, 2, 3],
      powerBall: 3
    }
  ];
}


module.exports = calculateTicketPickPrizes;