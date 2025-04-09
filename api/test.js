export default function handler(req, res) {
  const { method, body, query } = req;
  
  res.status(200).json({
    message: 'API is working correctly',
    method,
    query,
    body,
    timestamp: new Date().toISOString()
  });
} 