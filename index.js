process.on('unhandledRejection', error => {
  console.warn('unhandledRejection');
  console.error(error);
  process.exit(1);
});

process.on('uncaughtException', error => {
  console.warn('uncaughtException');
  console.error(error);
  process.exit(1);
});

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);


const initializeGameResults = require('./app/initializers').initializeGameResults;

async function startup() {
  await initializeGameResults({ log: true });

  const expressApp = require('./app/app');
  const port = process.env.PORT || 3000;
  const httpServer = await expressApp.listen(port);

  console.log(`App listening on port ${port}`);
  return httpServer;
}

const httpServer = startup();

function shutdown() {
  if (httpServer) httpServer.close();
  console.log('\nApp shutdown');
  process.exit(0);
}





