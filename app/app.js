const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const routes = require('./routes');
const errorMiddleware = require('./middleware/errors');

// Create Express App
const app = express();

// Pre Middleware
app
  .use(helmet.hidePoweredBy()) // Consider other security options
  .use(bodyParser.json())
  .use(morgan('combined'));

// Routes
app.use('/', routes);

// Post Middleware
app.use(errorMiddleware.errorHandler);

module.exports = app;
