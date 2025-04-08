import { useEffect, useState } from "react";
import { useRouter } from "next/router";

function JobList() {
  const router = useRouter();
  const { session_id } = router.query;
  const [jobs, setJobs] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch jobs based on session_id
  useEffect(() => {
    if (!session_id) return;

    const fetchJobs = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/jobs/${session_id}`);
        if (!response.ok) throw new Error("Failed to fetch jobs");
        
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Invalid job data");

        // Add unique IDs if not present
        const jobsWithIds = data.map((job, index) => ({
          ...job,
          id: job.id || `${session_id}-${index}`,
          job_url: job.job_url || job.link || "#" // Ensure job_url exists
        }));
        
        setJobs(jobsWithIds);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load jobs. Please try again.");
        setLoading(false);
      }
    };

    fetchJobs();
  }, [session_id]);

  const toggleJobSelection = (jobId) => {
    setSelectedJobs(prev => {
      const newSelected = new Set(prev);
      newSelected.has(jobId) ? newSelected.delete(jobId) : newSelected.add(jobId);
      return newSelected;
    });
  };

  const applyForJobs = () => {
    const selectedJobsArray = jobs.filter(job => selectedJobs.has(job.id));
    console.log("Applying for:", selectedJobsArray);
    alert(`Applying for ${selectedJobs.size} jobs!`);
    // Here you would typically send to your backend
  };

  return (
    <div className="min-h-screen bg-white p-6 font-[Inter,Poppins,Helvetica,sans-serif] relative">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-6">
        Job Listings
      </h1>

      {/* Apply Button */}
      {jobs.length > 0 && (
        <button
          onClick={applyForJobs}
          disabled={selectedJobs.size === 0}
          className={`absolute top-8 right-8 px-4 py-2 rounded-md text-sm shadow-md transition-all ${
            selectedJobs.size > 0
              ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Apply ({selectedJobs.size})
        </button>
      )}

      {/* Loading/Error States */}
      {loading && !error && (
        <p className="text-center text-gray-600 text-lg animate-pulse">
          Loading jobs...
        </p>
      )}
      
      {error && (
        <p className="text-red-500 text-center text-lg">{error}</p>
      )}

      {/* Job List Grid */}
      <div className="max-w-4xl mx-auto mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && !error && jobs.length === 0 && (
          <p className="text-center text-gray-600 text-lg col-span-full">
            No jobs found for this session.
          </p>
        )}

        {jobs.map((job) => (
          <div
            key={job.id}
            className={`relative p-5 bg-white shadow-md rounded-md flex flex-col justify-between border border-gray-200 transition-all duration-300 ${
              selectedJobs.has(job.id)
                ? "shadow-[0_0_15px_rgba(0,123,255,0.8)]"
                : "hover:shadow-lg"
            }`}
          >
            {/* Job Details */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
              <p className="text-gray-600 mt-1">{job.company}</p>
              <p className="text-gray-500 mt-1">{job.location}</p>
              {job.salary && job.salary !== "Salary not specified" && (
                <p className="text-green-700 font-medium mt-2">{job.salary}</p>
              )}
              <a
                href={job.job_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mt-3 inline-block"
              >
                View Job →
              </a>
            </div>

            {/* Checkbox */}
            <input
              type="checkbox"
              checked={selectedJobs.has(job.id)}
              onChange={() => toggleJobSelection(job.id)}
              className="w-5 h-5 accent-blue-600 cursor-pointer mt-4 self-end"
            />
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-10 bg-white py-6 border-t border-gray-200 w-full">
        <div className="max-w-4xl mx-auto px-4">
          <div className="overflow-hidden whitespace-nowrap">
            <span className="inline-block animate-marquee text-sm text-gray-500 font-medium">
              Quoted by JobSeekers | Trusted by Thousands | Empowering Careers Worldwide
            </span>
          </div>
          <p className="text-center text-gray-600 text-sm mt-4">
            Made with ❤️ by Your Team
          </p>
        </div>
      </footer>
    </div>
  );
}

export default JobList;