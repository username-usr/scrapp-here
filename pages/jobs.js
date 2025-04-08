import { useEffect, useState } from "react";
import { useRouter } from "next/router";

function JobList() {
  const router = useRouter();
  const { session_id } = router.query;
  const [jobs, setJobs] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!session_id) return;

    const fetchJobs = async () => {
      try {
        const response = await fetch(`/api/receive-jobs?sessionId=${session_id}`);
        if (!response.ok) throw new Error("Failed to fetch jobs");

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Invalid job data");

        const jobsWithIds = data.map((job, index) => ({
          ...job,
          id: job.id || `${session_id}-${index}`,
          job_url: job.job_url || job.link || "#"
        }));

        setJobs(jobsWithIds);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Could not load jobs. Please try again.");
        setLoading(false);
      }
    };

    fetchJobs();
  }, [session_id]);

  const toggleSelection = (jobId) => {
    setSelectedJobs(prev => {
      const updated = new Set(prev);
      updated.has(jobId) ? updated.delete(jobId) : updated.add(jobId);
      return updated;
    });
  };

  const applyForJobs = () => {
    const selected = jobs.filter(job => selectedJobs.has(job.id));
    alert(`Applying for ${selected.length} jobs.`);
    console.log("Selected:", selected);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Job Listings</h1>

      {loading && <p className="text-center text-gray-500">Loading jobs...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}
      {!loading && !error && jobs.length === 0 && (
        <p className="text-center text-gray-600">No jobs found.</p>
      )}

      {jobs.map((job) => (
        <div key={job.id} className="border p-4 mb-4 rounded-md shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold">{job.title}</h2>
              <p className="text-sm text-gray-700">{job.company}</p>
              <p className="text-sm text-gray-500">{job.location}</p>
              {job.salary && job.salary !== "Salary not specified" && (
                <p className="text-sm text-green-600">{job.salary}</p>
              )}
              <a
                href={job.job_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline text-sm mt-2 inline-block"
              >
                View Job
              </a>
            </div>
            <input
              type="checkbox"
              checked={selectedJobs.has(job.id)}
              onChange={() => toggleSelection(job.id)}
              className="mt-1"
            />
          </div>
        </div>
      ))}

      {jobs.length > 0 && (
        <button
          onClick={applyForJobs}
          disabled={selectedJobs.size === 0}
          className={`w-full py-2 mt-6 rounded text-white ${
            selectedJobs.size > 0 ? "bg-green-600 hover:bg-green-700" : "bg-gray-300"
          }`}
        >
          Apply for {selectedJobs.size} Job{selectedJobs.size !== 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
}

export default JobList;
