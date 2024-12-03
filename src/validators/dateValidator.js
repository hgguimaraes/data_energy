const { z } = require('zod');
const { parse, isValid } = require('date-fns');

const dateRangeSchema = z.object({
  startDate: z.string().refine(val => isValid(parse(val, 'yyyy-MM-dd', new Date())), {
    message: 'Invalid start date format. Use YYYY-MM-DD'
  }),
  endDate: z.string().refine(val => isValid(parse(val, 'yyyy-MM-dd', new Date())), {
    message: 'Invalid end date format. Use YYYY-MM-DD'
  })
});

function validateDateRange(query) {
  const { startDate, endDate } = dateRangeSchema.parse(query);
  return {
    startDate: parse(startDate, 'yyyy-MM-dd', new Date()),
    endDate: parse(endDate, 'yyyy-MM-dd', new Date())
  };
}

module.exports = {
  validateDateRange
};