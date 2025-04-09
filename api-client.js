import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Example data for betting slip
const bettingSlipData = {
  market: "Aaron Judge OVER 8.5 STOLEN BASES",
  betType: "PLAYER PROP",
  league: "MLB",
  date: "April 9, 2025",
  odds: "+163",
  betAmount: 5.00,
  toWinAmount: 13.15,
  autoCapture: true
};

// Function to generate and save betting slip
async function generateBettingSlip() {
  try {
    console.log('Generating betting slip...');
    
    // Make API request
    const response = await axios.post('http://localhost:3001/api/generate-slip', bettingSlipData, {
      responseType: 'arraybuffer'
    });
    
    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    
    // Write image to file
    const outputPath = path.join(outputDir, 'betting-slip.png');
    fs.writeFileSync(outputPath, response.data);
    
    console.log(`Betting slip saved to ${outputPath}`);
  } catch (error) {
    console.error('Error generating betting slip:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data.toString());
    }
  }
}

// Generate betting slip
generateBettingSlip(); 