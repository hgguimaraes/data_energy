const { PrismaClient } = require('@prisma/client');
const { extractBillData } = require('../services/pdfExtractor');
const { analyzeBillData } = require('../services/analyzer');
const { validateBillData } = require('../validators/billValidator');

const prisma = new PrismaClient();

async function processBill(req, res, next) {
  try {
    const pdfBuffer = req.body.pdfData;
    const billData = await extractBillData(pdfBuffer);
    
    const validatedData = validateBillData(billData);
    
    const existingBill = await prisma.energyBill.findFirst({
      where: {
        referenceYear: validatedData.referenceYear,
        referenceMonth: validatedData.referenceMonth
      }
    });

    let bill;
    if (existingBill) {
      if (JSON.stringify(existingBill) !== JSON.stringify(validatedData)) {
        bill = await prisma.energyBill.update({
          where: { id: existingBill.id },
          data: validatedData
        });
      } else {
        bill = existingBill;
      }
    } else {
      bill = await prisma.energyBill.create({
        data: validatedData
      });
    }

    await analyzeBillData(bill.billDate);
    
    res.json(bill);
  } catch (error) {
    next(error);
  }
}

async function getBill(req, res, next) {
  try {
    const bill = await prisma.energyBill.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    
    res.json(bill);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  processBill,
  getBill
};