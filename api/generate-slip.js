import puppeteer from 'puppeteer-core';
import chrome from '@vercel/chrome';

export default async function handler(req, res) {
  // Only support POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Received request to generate betting slip');
    const slipData = req.body;
    
    // Validate required parameters
    const requiredParams = ['betType', 'market', 'league', 'odds', 'betAmount', 'toWinAmount'];
    const missingParams = requiredParams.filter(param => slipData[param] === undefined);
    
    if (missingParams.length > 0) {
      console.error('Missing required parameters:', missingParams);
      return res.status(400).json({
        error: `Missing required parameters: ${missingParams.join(', ')}`
      });
    }
    
    console.log('All required parameters present');
    
    // Generate the image
    try {
      const imageBuffer = await generateBettingSlipImage(slipData, req);
      
      if (!imageBuffer || imageBuffer.length === 0) {
        console.error('Generated image is empty');
        return res.status(500).json({ error: 'Generated image is empty' });
      }
      
      console.log('Image generated successfully, size:', imageBuffer.length, 'bytes');
      
      // Return the image
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', 'inline; filename="betting-slip.png"');
      return res.status(200).send(imageBuffer);
    } catch (genError) {
      console.error('Error during image generation:', genError);
      return res.status(500).json({ error: 'Failed to generate betting slip image', details: genError.message });
    }
  } catch (error) {
    console.error('Unexpected error handling generate-slip request:', error);
    return res.status(500).json({ error: 'Server error processing request', details: error.message });
  }
}

// Generate Betting Slip Image
async function generateBettingSlipImage(slipData, req) {
  console.log('Generating betting slip with data:', JSON.stringify(slipData, null, 2));
  
  let browser = null;
  try {
    // Launch browser using Vercel's chrome package
    browser = await puppeteer.launch({
      executablePath: chrome.executablePath,
      args: chrome.args,
      headless: chrome.headless,
    });
    
    // Create a new page
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 800, height: 800 });
    
    // Determine base URL
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host || process.env.VERCEL_URL;
    const baseUrl = `${protocol}://${host}`;
    
    // Create query string from slipData
    const queryParams = new URLSearchParams();
    Object.entries(slipData).forEach(([key, value]) => {
      queryParams.append(key, value);
    });
    
    // Add autoCapture flag for API
    queryParams.append('autoCapture', 'true');
    
    // Navigate to the page
    const url = `${baseUrl}?${queryParams.toString()}`;
    console.log('Navigating to:', url);
    
    await page.goto(url, { 
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Wait for the betting slip to render
    await page.waitForSelector('#betting-slip', { visible: true, timeout: 10000 });
    
    // Wait a moment for animations
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get betting slip element
    const slipElement = await page.$('#betting-slip');
    if (!slipElement) {
      throw new Error('Could not find betting slip element');
    }
    
    // Take screenshot
    const screenshot = await slipElement.screenshot({ type: 'png' });
    
    return screenshot;
  } catch (error) {
    console.error('Error generating betting slip image:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
} 