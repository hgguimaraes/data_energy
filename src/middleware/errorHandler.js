function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'BillExtractionError') {
    return res.status(400).json({ error: err.message });
  }

  if (err.name === 'AnalysisError') {
    return res.status(400).json({ error: err.message });
  }

  if (err.name === 'ZodError') {
    return res.status(400).json({ error: 'Validation error', details: err.errors });
  }

  res.status(500).json({ error: 'Internal server error' });
}

module.exports = {
  errorHandler
};