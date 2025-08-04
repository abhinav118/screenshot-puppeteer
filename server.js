// server.js
const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.json());

app.post('/screenshot', async (req, res) => {
  try {
    const { html, width = 1200, height = 800, deviceScaleFactor = 2 } = req.body;
    
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor });
    await page.setContent(html);
    await page.waitForTimeout(1000);
    
    const screenshot = await page.screenshot({ 
      type: 'png',
      fullPage: true 
    });
    
    await browser.close();
    
    res.set('Content-Type', 'image/png');
    res.send(screenshot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});