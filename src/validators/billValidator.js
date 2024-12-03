const { z } = require('zod');

const billSchema = z.object({
  referenceYear: z.number().int().min(2000).max(2100),
  referenceMonth: z.number().int().min(1).max(12),
  billDate: z.date(),
  previousReading: z.number().positive(),
  currentReading: z.number().positive(),
  daysUntilNextReading: z.number().int().positive(),
  consumptionKWh: z.number().positive(),
  injectedKWh: z.number().positive().nullable(),
  availabilityCost: z.number().positive(),
  flagCost: z.number().positive().nullable(),
  publicLightingFee: z.number().positive(),
  totalAmount: z.number().positive()
});

function validateBillData(data) {
  return billSchema.parse(data);
}

module.exports = {
  validateBillData
};