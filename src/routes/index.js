const billRoutes = require('./billRoutes');
const analysisRoutes = require('./analysisRoutes');

function setupRoutes(app) {
  app.use('/api/bills', billRoutes);
  app.use('/api/analysis', analysisRoutes);
}

module.exports = { setupRoutes };