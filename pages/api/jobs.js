// pages/api/jobs.js

export default async function handler(req, res) {
    const { sessionId } = req.query;
    const url = `https://nxjblakrtqfjqzydtqaj.supabase.co/storage/v1/object/public/data-from-bakend/jobs/jobs_${sessionId}.json`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Supabase returned ${response.status}`);
      }
  
      const data = await response.json();
      res.status(200).json(data);
  
    } catch (err) {
      console.error("Error fetching from Supabase:", err);
      res.status(500).json({ error: "Could not retrieve job data" });
    }
  }
  