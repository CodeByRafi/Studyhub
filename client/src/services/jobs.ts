const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export const getJobs = async (type?: string): Promise<any[]> => {
  try {
    const url = type ? `${API_BASE}/api/jobs?type=${type}` : `${API_BASE}/api/jobs`;
    const response = await fetch(url);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
};

export const createJob = async (
  jobData: {
    title: string;
    company: string;
    description: string;
    type: string;
    location: string;
    salary_range: string;
    requirements: string;
    contact_email: string;
  },
  token: string
): Promise<any | null> => {
  try {
    const response = await fetch(`${API_BASE}/api/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jobData),
    });

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error creating job:', error);
    return null;
  }
};

export const applyForJob = async (
  jobId: string,
  message: string,
  token: string
): Promise<any | null> => {
  try {
    const response = await fetch(`${API_BASE}/api/jobs/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ job_id: jobId, message }),
    });

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error applying for job:', error);
    return null;
  }
};