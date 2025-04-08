let jobCache = {}; // In-memory storage

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Store jobs in memory
    const { sessionId, jobs } = req.body;
    jobCache[sessionId] = jobs;
    res.json({ success: true });
    
    // Auto-clear after 24 hours
    setTimeout(() => delete jobCache[sessionId], 86400000);
  } 
  else if (req.method === 'GET') {
    // Retrieve jobs
    const { sessionId } = req.query;
    res.json(jobCache[sessionId] || []);
  }
}