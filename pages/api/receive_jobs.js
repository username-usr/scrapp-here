// pages/api/jobs.js
let jobStore = {}; // Temporary in-memory storage

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Handle job data submission
    const { sessionId, jobs } = req.body;
    console.log("Received jobs for session:", sessionId);
    console.log(jobs);

    jobStore[sessionId] = jobs;
    res.status(200).json({ message: "Jobs received", url: `/jobs?sessionId=${sessionId}` });
  } 
  else if (req.method === 'GET') {
    // Handle job data retrieval
    const { sessionId } = req.query;
    res.status(200).json(jobStore[sessionId] || []);
  }
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}