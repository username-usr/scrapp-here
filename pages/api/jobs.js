// File: pages/api/jobs.js

let jobStore = {}; // This stores jobs in memory (per sessionId)

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { sessionId, jobs } = req.body;

    if (!sessionId || !Array.isArray(jobs)) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    console.log(jobs)
    console.log("Received jobs for session:", sessionId);
    jobStore[sessionId] = jobs;

    return res.status(200).json({ success: true });
  }

  if (req.method === 'GET') {
    const { sessionId } = req.query;

    if (!sessionId) {
      return res.status(400).json({ error: "Missing sessionId" });
    }

    const sessionJobs = jobStore[sessionId] || [];
    console.log("Returning jobs for session:", sessionId);

    return res.status(200).json(sessionJobs);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`); 
}
