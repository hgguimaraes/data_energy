const { PrismaClient } = require('@prisma/client');
const { validateDateRange } = require('../validators/dateValidator');

const prisma = new PrismaClient();

async function getAnalysis(req, res, next) {
  try {
    const { startDate, endDate } = validateDateRange(req.query);
    
    const analysis = await prisma.analysis.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        date: 'asc'
      }
    });
    
    res.json(analysis);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAnalysis
};