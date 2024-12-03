function calculateEfficiency(production, consumption) {
  return (production / consumption) * 100;
}

function calculateSavings(production, totalAmount, consumption) {
  const energyRate = totalAmount / consumption;
  return production * energyRate;
}

module.exports = {
  calculateEfficiency,
  calculateSavings
};