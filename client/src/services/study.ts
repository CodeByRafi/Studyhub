const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';

// Department suggestions with course suggestions
export const DEPARTMENT_SUGGESTIONS = [
  { id: "cse", name: "Computer Science & Engineering", icon: "💻" },
  { id: "eee", name: "Electrical & Electronics Engineering", icon: "⚡" },
  { id: "english", name: "English", icon: "📖" },
  { id: "bba", name: "Business Administration", icon: "💼" },
  { id: "su", name: "Statistics & Unversity", icon: "📊" },
  { id: "data-science", name: "Data Science", icon: "📈" },
  { id: "economics", name: "Economics", icon: "💰" },
];

export const COURSE_SUGGESTIONS: { [key: string]: string[] } = {
  cse: [
    "Data Structures",
    "Algorithms",
    "Database Management Systems",
    "Operating Systems",
    "Object-Oriented Programming",
    "Web Development",
    "Artificial Intelligence",
    "Machine Learning",
    "Software Engineering",
    "Computer Networks",
  ],
  eee: [
    "Circuit Theory",
    "Electronics",
    "Signals & Systems",
    "Power Systems",
    "Electromagnetic Theory",
    "Digital Electronics",
    "Control Systems",
    "Microprocessors",
    "Power Electronics",
    "Electrical Machines",
  ],
  english: [
    "Literary Theory",
    "Poetry",
    "Drama",
    "Linguistics",
    "Grammar",
    "Creative Writing",
    "American Literature",
    "British Literature",
    "Academic Writing",
    "Phonetics",
  ],
  bba: [
    "Accounting",
    "Finance",
    "Marketing",
    "Management",
    "Economics",
    "Business Law",
    "Human Resources",
    "Organizational Behavior",
    "Strategic Management",
    "Business Communication",
  ],
  su: [
    "Statistics",
    "Probability",
    "Inferential Statistics",
    "Regression Analysis",
    "Time Series",
    "Experimental Design",
    "Sampling Methods",
    "Data Analysis",
    "Statistical Modeling",
  ],
  "data-science": [
    "Python for Data Science",
    "Machine Learning",
    "Data Mining",
    "Statistics",
    "Data Visualization",
    "Big Data",
    "Deep Learning",
    "Natural Language Processing",
    "Computer Vision",
    "Time Series Analysis",
  ],
  economics: [
    "Microeconomics",
    "Macroeconomics",
    "Econometrics",
    "Development Economics",
    "International Economics",
    "Public Finance",
    "Monetary Economics",
    "Game Theory",
    "Industrial Organization",
  ],
};

export function getDepartmentSuggestions() {
  return DEPARTMENT_SUGGESTIONS;
}

export function getCourseSuggestions(departmentId: string): string[] {
  return COURSE_SUGGESTIONS[departmentId] || [];
}

export async function getDepartments() {
  try {
    const response = await fetch(`${API_URL}/api/study/departments`);
    if (!response.ok) throw new Error('Failed to fetch departments');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching departments:', error);
    return [];
  }
}

export async function getCourses(departmentId: string) {
  try {
    const response = await fetch(`${API_URL}/api/study/courses?department_id=${departmentId}`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

export async function uploadNote(title: string, courseId: string, file: File, token: string) {
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('course_id', courseId);
    formData.append('file', file);

    const response = await fetch(`${API_URL}/api/study/notes/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload note');
    }

    return data.data || null;
  } catch (error: any) {
    console.error('Error uploading note:', error);
    throw error;
  }
}

export async function getNotes(params: { department?: string; course?: string; searchQuery?: string } = {}) {
  try {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v != null && v !== '')
    );
    const query = new URLSearchParams(cleanParams as Record<string, string>).toString();
    const url = `${API_URL}/api/study/notes${query ? `?${query}` : ''}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch notes');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
}

export async function getNoteById(noteId: string) {
  try {
    const response = await fetch(`${API_URL}/api/study/notes/${noteId}`);
    if (!response.ok) throw new Error('Failed to fetch note');
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error fetching note:', error);
    return null;
  }
}

export async function addCourse(departmentId: string, courseName: string, token?: string) {
  try {
    const response = await fetch(`${API_URL}/api/study/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ department_id: departmentId, name: courseName }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to add course');
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error adding course:', error);
    return null;
  }
}

export async function getComments(noteId: string) {
  try {
    const response = await fetch(`${API_URL}/api/study/comments?note_id=${noteId}`);
    if (!response.ok) throw new Error('Failed to fetch comments');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

export async function addComment(noteId: string, text: string, token: string) {
  try {
    const response = await fetch(`${API_URL}/api/study/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ note_id: noteId, text }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add comment');
    }

    return data.data || null;
  } catch (error: any) {
    console.error('Error adding comment:', error);
    throw error;
  }
}

export async function addRating(noteId: string, value: number, token: string) {
  try {
    const response = await fetch(`${API_URL}/api/study/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ note_id: noteId, value }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add rating');
    }

    return data.data || null;
  } catch (error: any) {
    console.error('Error adding rating:', error);
    throw error;
  }
}

export async function uploadQuestion(title: string, courseId: string, file: File, token: string) {
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('course_id', courseId);
    formData.append('file', file);

    const response = await fetch(`${API_URL}/api/study/questions/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload question');
    }

    return data.data || null;
  } catch (error: any) {
    console.error('Error uploading question:', error);
    throw error;
  }
}

export async function getQuestions(params: { department?: string; course?: string; searchQuery?: string } = {}) {
  try {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v != null && v !== '')
    );
    const query = new URLSearchParams(cleanParams as Record<string, string>).toString();
    const url = `${API_URL}/api/study/questions${query ? `?${query}` : ''}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch questions');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
}

export async function getQuestionById(questionId: string) {
  try {
    const response = await fetch(`${API_URL}/api/study/questions/${questionId}`);
    if (!response.ok) throw new Error('Failed to fetch question');
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error fetching question:', error);
    return null;
  }
}

export async function getQuestionComments(questionId: string) {
  try {
    const response = await fetch(`${API_URL}/api/study/question-comments?question_id=${questionId}`);
    if (!response.ok) throw new Error('Failed to fetch comments');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

export async function addQuestionComment(questionId: string, text: string, token: string) {
  try {
    const response = await fetch(`${API_URL}/api/study/question-comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ question_id: questionId, content: text }),
    });

    if (!response.ok) throw new Error('Failed to add comment');
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error adding comment:', error);
    return null;
  }
}

export async function addQuestionRating(questionId: string, value: number, token: string) {
  try {
    const response = await fetch(`${API_URL}/api/study/question-ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ question_id: questionId, value }),
    });

    if (!response.ok) throw new Error('Failed to add rating');
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error adding rating:', error);
    return null;
  }
}