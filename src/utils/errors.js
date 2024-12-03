class BillExtractionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BillExtractionError';
  }
}

class AnalysisError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AnalysisError';
  }
}

module.exports = {
  BillExtractionError,
  AnalysisError
};