# BettingSlip Maker

A modern web application for creating customizable betting slips that are visually appealing and optimized for social sharing. Create, customize, and share betting slips across social media with this easy-to-use tool.

## Features

- **Betting Slip Customization**: Create custom betting slips for different leagues (MLB, NFL, NBA, NHL)
- **Multiple Bet Types**: Support for Money Line, Spread, Total Points, and Player Prop bets
- **Visual Styling**: Professional design with league-specific styling
- **Social Sharing**: Copy betting slips as images for easy social media sharing
- **Responsive Design**: Works on desktop and mobile devices
- **API Integration**: Support for generating betting slips programmatically

## Technology Stack

- React.js with TypeScript
- Vite for fast development and building
- Express.js for the backend API
- HTML2Canvas for image generation
- TailwindCSS for styling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/bettingslip-maker.git
cd bettingslip-maker
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Start the API server (in a separate terminal)
```bash
npm run server
# or
yarn server
```

## Usage

1. Open your browser and navigate to `http://localhost:5173/`
2. Use the control panel to customize your betting slip:
   - Select a league (MLB, NFL, NBA, NHL)
   - Choose a bet type (Money Line, Spread, Total Points, Player Prop)
   - Configure bet details (team, spread, odds, etc.)
   - Set bet amount
3. Click "Copy" to copy the betting slip as an image
4. Share directly to social media platforms

## API Reference

The BettingSlip Maker includes a comprehensive API that allows you to generate betting slips programmatically. This is useful for integrating with other applications or creating automated betting slip generation workflows.

### API Endpoints

#### 1. Generate Betting Slip

Creates a betting slip based on the provided parameters.

```
POST /api/generate-slip
```

**Request Body Parameters:**

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| betType | string | Type of bet (MONEY LINE, SPREAD, TOTAL POINTS, PLAYER PROP) | Yes |
| market | string | The market for the bet (e.g., team name, matchup) | Yes |
| league | string | Sports league (MLB, NFL, NBA, NHL) | Yes |
| odds | string | Odds for the bet (e.g., "+163", "-110") | Yes |
| betAmount | number | Amount of the bet | Yes |
| toWinAmount | number | Potential winnings | Yes |
| date | string | Date of the event (optional) | No |

**Example Request:**

```json
{
  "betType": "MONEY LINE",
  "market": "Boston Red Sox",
  "league": "MLB",
  "odds": "+163",
  "betAmount": 5.00,
  "toWinAmount": 13.16
}
```

**Example Response:**

```json
{
  "message": "Betting slip data received successfully",
  "data": {
    "betType": "MONEY LINE",
    "market": "Boston Red Sox",
    "league": "MLB",
    "odds": "+163",
    "betAmount": 5.00,
    "toWinAmount": 13.16
  },
  "timestamp": "2025-04-09T14:30:00.000Z",
  "note": "Image generation is not implemented in this version"
}
```

**Notes:**
- The current API implementation returns a JSON response with the betting slip data
- Future versions will return an actual PNG image of the rendered betting slip

#### 2. API Status Check

Check if the API server is running.

```
GET /api/ping
```

**Example Response:**

```json
{
  "message": "Betting slip server is running",
  "timestamp": "2025-04-09T14:30:00.000Z"
}
```

#### 3. API Test Endpoint

Test the API with various HTTP methods and parameters.

```
ANY /api/test
```

**Example Response:**

```json
{
  "message": "API is working correctly",
  "method": "GET",
  "query": {},
  "body": {},
  "timestamp": "2025-04-09T14:30:00.000Z"
}
```

### Using the API

You can interact with the API using any HTTP client such as cURL, Postman, or programming languages with HTTP libraries.

**Example using cURL:**

```bash
curl -X POST https://your-vercel-domain.vercel.app/api/generate-slip \
  -H "Content-Type: application/json" \
  -d '{
    "betType": "MONEY LINE",
    "market": "Boston Red Sox",
    "league": "MLB",
    "odds": "+163",
    "betAmount": 5.00,
    "toWinAmount": 13.16
  }'
```

**Example using JavaScript/Axios:**

```javascript
import axios from 'axios';

const generateSlip = async () => {
  try {
    const response = await axios.post('https://your-vercel-domain.vercel.app/api/generate-slip', {
      betType: "MONEY LINE",
      market: "Boston Red Sox",
      league: "MLB",
      odds: "+163",
      betAmount: 5.00,
      toWinAmount: 13.16
    });
    
    console.log(response.data);
  } catch (error) {
    console.error('Error generating slip:', error);
  }
};

generateSlip();
```

### Development vs. Production

- **Local Development**: When running locally with `npm run server`, the Express server includes additional functionality such as starting a Vite development server and uses Puppeteer for image generation.

- **Production (Vercel)**: In the production environment, the API runs as serverless functions. The current implementation returns JSON responses rather than generating images due to limitations with Puppeteer in serverless environments.

## Future API Enhancements

Plans for future API improvements include:

1. **Image Generation**: Implementing proper image generation in the serverless environment
2. **Social Media Integration**: Direct posting to social media platforms
3. **Batch Processing**: Generating multiple betting slips in a single request
4. **Templates**: Support for custom templates and themes
5. **Authentication**: Adding API keys for secure access

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Designed for sports bettors and content creators
- Inspiration from modern betting platforms
