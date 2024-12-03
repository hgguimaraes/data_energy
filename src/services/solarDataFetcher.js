const puppeteer = require('puppeteer');

async function fetchSolarData(date) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Navigate to solar monitoring system (URL needs to be configured)
    await page.goto(process.env.SOLAR_MONITORING_URL);
    
    // Login if required
    await page.type('#username', process.env.SOLAR_USERNAME);
    await page.type('#password', process.env.SOLAR_PASSWORD);
    await page.click('#login-button');
    
    // Navigate to production data for specific date
    // This will need to be customized based on the actual monitoring system
    await page.goto(`${process.env.SOLAR_MONITORING_URL}/production/${date}`);
    
    // Extract production data
    const productionData = await page.evaluate(() => {
      // This selector will need to be adjusted based on the actual page structure
      const production = document.querySelector('.daily-production').textContent;
      return parseFloat(production);
    });
    
    await browser.close();
    
    return productionData;
  } catch (error) {
    throw new Error(`Failed to fetch solar data: ${error.message}`);
  }
}

module.exports = {
  fetchSolarData
};