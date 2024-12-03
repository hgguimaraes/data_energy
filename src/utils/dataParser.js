const { parse } = require('date-fns');

function parseDate(dateString) {
  return parse(dateString, 'dd/MM/yyyy', new Date());
}

function extractNumber(text, pattern) {
  const match = text.match(pattern);
  return match ? parseFloat(match[1]) : null;
}

module.exports = {
  parseDate,
  extractNumber
};