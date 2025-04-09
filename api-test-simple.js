import axios from 'axios';

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

// Check if server is running
async function pingServer() {
  try {
    const response = await axios.get('http://localhost:3001/api/ping');
    console.log('Server ping successful:', response.data);
    return true;
  } catch (error) {
    console.error('Server ping failed:', error.message);
    return false;
  }
}

// Function to generate betting slip with detailed error handling
async function testBettingSlipAPI() {
  try {
    console.log('Testing server connection...');
    const isServerRunning = await pingServer();
    
    if (!isServerRunning) {
      console.error('Server is not responding. Make sure it is running on port 3001.');
      return;
    }
    
    // Log exact data being sent
    console.log('Sending API request with data:', JSON.stringify(bettingSlipData, null, 2));
    console.log('Checking for required fields:');
    ['betType', 'market', 'league', 'odds', 'betAmount', 'toWinAmount'].forEach(field => {
      console.log(`- ${field}: ${bettingSlipData[field] !== undefined ? 'Present' : 'MISSING'}`);
    });
    
    // Make API request with extended timeout
    console.log('Sending request to http://localhost:3001/api/generate-slip');
    const response = await axios.post('http://localhost:3001/api/generate-slip', bettingSlipData, {
      responseType: 'arraybuffer',
      timeout: 30000, // 30 second timeout
    });
    
    console.log('API response status:', response.status);
    console.log('API response headers:', response.headers);
    console.log('Received data of type:', typeof response.data);
    console.log('Received data length:', response.data.length, 'bytes');
    
    if (response.data && response.data.length > 0) {
      console.log('Successfully received betting slip image!');
    } else {
      console.error('Received empty response from server');
    }
  } catch (error) {
    console.error('Error occurred:');
    console.error('- Message:', error.message);
    
    if (error.response) {
      console.error('- Status:', error.response.status);
      console.error('- Headers:', error.response.headers);
      
      // If the response is JSON, try to parse it
      const contentType = error.response.headers['content-type'];
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = JSON.parse(Buffer.from(error.response.data).toString());
          console.error('- Error data:', errorData);
        } catch (e) {
          console.error('- Could not parse error data:', Buffer.from(error.response.data).toString());
        }
      } else {
        console.error('- Error data type:', contentType);
        console.error('- Error data length:', error.response.data?.length || 0, 'bytes');
      }
    }
    
    if (error.request) {
      console.error('- Request was made but no response received');
    }
    
    console.error('- Error configuration:', error.config);
  }
}

// Run the test
testBettingSlipAPI(); 