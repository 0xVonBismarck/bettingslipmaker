export default function handler(req, res) {
  res.status(200).json({ 
    message: 'Betting slip server is running',
    timestamp: new Date().toISOString() 
  });
} 