const pdfParse = require('pdf-parse');
const { parseDate, extractNumber } = require('../utils/dataParser');
const { BillExtractionError } = require('../utils/errors');

async function extractBillData(pdfBuffer) {
  try {
    const data = await pdfParse(pdfBuffer);
    const text = data.text;

    const referenceMatch = text.match(/(\d{3})\/(\d{2})/);
    if (!referenceMatch) {
      throw new BillExtractionError('Could not extract reference period');
    }

    const readings = extractReadings(text);
    const consumption = extractConsumption(text);
    const costs = extractCosts(text);

    return {
      referenceYear: 2000 + parseInt(referenceMatch[2]),
      referenceMonth: Math.ceil(parseInt(referenceMatch[1]) / 30.44),
      billDate: readings.currentReadingDate,
      previousReading: readings.previous,
      currentReading: readings.current,
      daysUntilNextReading: readings.daysUntilNext,
      consumptionKWh: consumption.consumed,
      injectedKWh: consumption.injected,
      availabilityCost: costs.availability,
      flagCost: costs.flag,
      publicLightingFee: costs.publicLighting,
      totalAmount: costs.total
    };
  } catch (error) {
    throw new BillExtractionError(`PDF extraction failed: ${error.message}`);
  }
}

function extractReadings(text) {
  const previousMatch = text.match(/Leitura anterior:\s*(\d+)/i);
  const currentMatch = text.match(/Leitura atual:\s*(\d+)/i);
  const daysMatch = text.match(/Próxima leitura:\s*(\d+)\s*dias/i);
  const dateMatch = text.match(/Data da leitura:\s*(\d{2}\/\d{2}\/\d{4})/i);

  if (!previousMatch || !currentMatch || !daysMatch || !dateMatch) {
    throw new BillExtractionError('Could not extract reading information');
  }

  return {
    previous: parseFloat(previousMatch[1]),
    current: parseFloat(currentMatch[1]),
    daysUntilNext: parseInt(daysMatch[1]),
    currentReadingDate: parseDate(dateMatch[1])
  };
}

function extractConsumption(text) {
  const consumedMatch = text.match(/Consumo.*?(\d+(?:\.\d+)?)\s*kWh/i);
  const injectedMatch = text.match(/Injetado.*?(\d+(?:\.\d+)?)\s*kWh/i);

  if (!consumedMatch) {
    throw new BillExtractionError('Could not extract consumption information');
  }

  return {
    consumed: parseFloat(consumedMatch[1]),
    injected: injectedMatch ? parseFloat(injectedMatch[1]) : null
  };
}

function extractCosts(text) {
  const availabilityMatch = text.match(/Custo de disponibilidade.*?R\$\s*(\d+(?:\.\d+)?)/i);
  const flagMatch = text.match(/Adicional Bandeira.*?R\$\s*(\d+(?:\.\d+)?)/i);
  const lightingMatch = text.match(/Cip-Ilum Pub.*?R\$\s*(\d+(?:\.\d+)?)/i);
  const totalMatch = text.match(/Total.*?R\$\s*(\d+(?:\.\d+)?)/i);

  if (!availabilityMatch || !lightingMatch || !totalMatch) {
    throw new BillExtractionError('Could not extract cost information');
  }

  return {
    availability: parseFloat(availabilityMatch[1]),
    flag: flagMatch ? parseFloat(flagMatch[1]) : null,
    publicLighting: parseFloat(lightingMatch[1]),
    total: parseFloat(totalMatch[1])
  };
}

module.exports = {
  extractBillData
};