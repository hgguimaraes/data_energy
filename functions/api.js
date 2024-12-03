const express = require('express');
const serverless = require('serverless-http');
const { setupRoutes } = require('../src/routes');
const { errorHandler } = require('../src/middleware/errorHandler');

const app = express();
app.use(express.json());

setupRoutes(app);
app.use(errorHandler);

module.exports.handler = serverless(app);