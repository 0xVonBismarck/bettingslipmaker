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

## API Usage

The application includes an API endpoint for generating betting slips programmatically:

```
POST /api/generate-slip
```

Example request body:
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

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Designed for sports bettors and content creators
- Inspiration from modern betting platforms
