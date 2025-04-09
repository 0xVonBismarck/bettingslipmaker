import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const isVercel = process.env.VERCEL === '1';

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static('dist')); // Serve the built React app

// Store active Vite processes
let viteProcess = null;

// Start Vite dev server if not in production
function startViteServer() {
  if (process.env.NODE_ENV !== 'production' && !viteProcess && !isVercel) {
    viteProcess = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true
    });
    
    console.log('Vite development server started');
    
    viteProcess.on('close', (code) => {
      console.log(`Vite process exited with code ${code}`);
      viteProcess = null;
    });
  }
}

// Generate Betting Slip Image
async function generateBettingSlipImage(slipData) {
  console.log('Generating betting slip with data:', JSON.stringify(slipData, null, 2));
  
  let browser = null;
  try {
    // Launch a new browser instance with settings for Vercel
    const options = {
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    };
    
    // Add Chrome executable path for Vercel
    if (isVercel) {
      options.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || 
                              '/usr/bin/chromium-browser';
    }
    
    browser = await puppeteer.launch(options);
    
    // Create a new page
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 800, height: 800 });
    
    // Determine base URL
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NODE_ENV === 'production' 
        ? 'http://localhost:3001' 
        : 'http://localhost:5173';
    
    // Create query string from slipData
    const queryParams = new URLSearchParams();
    Object.entries(slipData).forEach(([key, value]) => {
      queryParams.append(key, value);
    });
    
    // Add autoCapture flag for API
    queryParams.append('autoCapture', 'true');
    
    // Navigate to the page
    await page.goto(`${baseUrl}?${queryParams.toString()}`, { 
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

// API Endpoints

// Generate betting slip image
app.post('/api/generate-slip', async (req, res) => {
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
      const imageBuffer = await generateBettingSlipImage(slipData);
      
      if (!imageBuffer || imageBuffer.length === 0) {
        console.error('Generated image is empty');
        return res.status(500).json({ error: 'Generated image is empty' });
      }
      
      console.log('Image generated successfully, size:', imageBuffer.length, 'bytes');
      
      // Return the image
      res.set('Content-Type', 'image/png');
      res.set('Content-Disposition', 'inline; filename="betting-slip.png"');
      res.send(imageBuffer);
      
      console.log('Response sent successfully');
    } catch (genError) {
      console.error('Error during image generation:', genError);
      console.error(genError.stack);
      res.status(500).json({ error: 'Failed to generate betting slip image', details: genError.message });
    }
  } catch (error) {
    console.error('Unexpected error handling generate-slip request:', error);
    console.error(error.stack);
    res.status(500).json({ error: 'Server error processing request', details: error.message });
  }
});

// Simple ping endpoint to check if server is running
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Betting slip server is running' });
});

// Only start the server when not on Vercel (serverless)
if (!isVercel) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startViteServer();
  });
  
  // Handle shutdown
  process.on('SIGINT', () => {
    if (viteProcess) {
      viteProcess.kill();
    }
    process.exit();
  });
  
  process.on('SIGTERM', () => {
    if (viteProcess) {
      viteProcess.kill();
    }
    process.exit();
  });
}

// Export the Express app for Vercel
export default app; 