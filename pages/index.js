import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    jobPreferences: '',
    location: '',
    email: '',
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('resume', formData.resume);
    data.append('data', JSON.stringify({
      jobPreferences: formData.jobPreferences.split(','),
      location: formData.location,
      email: formData.email,
    }));

    try {
      const res = await axios.post('http://localhost:5000/api/submit', data);
      setJobs(res.data.jobs); // Directly set jobs from response
      alert(`Found ${res.data.jobs.length} jobs!`);
    } catch (err) {
      alert('Error fetching jobs!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Job Scraper</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Job Preferences (comma-separated):</label>
          <input
            type="text"
            name="jobPreferences"
            value={formData.jobPreferences}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Resume:</label>
          <input
            type="file"
            name="resume"
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Find Jobs'}
        </button>
      </form>

      {jobs.length > 0 && (
        <div>
          <h2>Job Results</h2>
          <ul>
            {jobs.map((job, index) => (
              <li key={index}>
                <h3>{job.title}</h3>
                <p>{job.company} - {job.location}</p>
                <p>Salary: {job.salary}</p>
                <a href={job.job_url} target="_blank">View Job</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}