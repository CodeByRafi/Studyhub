const fetch = globalThis.fetch;
const base = 'http://localhost:5001';
const signupBody = {email:'test.save.profile2@example.com', password:'Test1234!', first_name:'Test', last_name:'Saver', department_id:1};
(async () => {
  try {
    const signupRes = await fetch(`${base}/api/auth/signup`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(signupBody),
    });
    console.log('signup status', signupRes.status);
    const signupData = await signupRes.json();
    console.log('signup', signupData);

    const loginRes = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(signupBody),
    });
    console.log('login status', loginRes.status);
    const loginData = await loginRes.json();
    console.log('login', loginData);

    const token = loginData.data?.token;
    if (!token) {
      throw new Error('no token');
    }

    const profileBody = {
      headline: 'Test Hub',
      current_status: 'Student',
      bio: 'Testing networking profile save',
      skills: 'React,Node',
      linkedin_url: 'https://linkedin.com/in/test',
      github_url: 'https://github.com/test',
      portfolio_url: 'https://test.com',
      graduation_year: 2026,
      open_to: 'Mentoring, Collaboration',
    };

    const profileRes = await fetch(`${base}/api/networking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileBody),
    });
    console.log('profile status', profileRes.status);
    const profileData = await profileRes.json();
    console.log('profile', profileData);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
