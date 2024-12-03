const { PrismaClient } = require('@prisma/client');
const { AnalysisError } = require('../utils/errors');
const { calculateEfficiency, calculateSavings } = require('../utils/calculations');

const prisma = new PrismaClient();

async function analyzeBillData(date) {
  try {
    const [bill, solarData] = await Promise.all([
      prisma.energyBill.findFirst({ where: { billDate: date } }),
      prisma.solarProduction.findFirst({ where: { date: date } })
    ]);

    if (!bill || !solarData) {
      throw new AnalysisError('Missing data for analysis');
    }

    const efficiency = calculateEfficiency(solarData.productionKWh, bill.consumptionKWh);
    const savings = calculateSavings(solarData.productionKWh, bill.totalAmount, bill.consumptionKWh);

    await prisma.analysis.create({
      data: {
        date: date,
        energyConsumption: bill.consumptionKWh,
        solarProduction: solarData.productionKWh,
        efficiency: efficiency,
        savings: savings
      }
    });
  } catch (error) {
    throw new AnalysisError(`Analysis failed: ${error.message}`);
  }
}

module.exports = {
  analyzeBillData
};