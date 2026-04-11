require('dotenv').config();
const pool = require('./config/db');

async function cleanDemoQuestions() {
  try {
    const res = await pool.query("SELECT id, title FROM questions");
    console.log(`Found ${res.rowCount} total questions in the database.`);
    
    // We will delete rows whose title seems like a test payload
    // such as "were", "dfg", "fxcgf", or standard test terms like "chemistry", "database", "microprocessor"
    
    // Alternatively, we can just delete EVERYTHING to give them a 100% clean slate as requested
    console.log("Wiping all test questions to guarantee production-ready blank state...");
    
    await pool.query("DELETE FROM question_ratings");
    await pool.query("DELETE FROM question_comments");
    await pool.query("DELETE FROM questions");
    
    console.log("Successfully deleted all demo/test questions. Database is now in a pristine state.");
    process.exit(0);
  } catch(e) {
    console.error("Error wiping demo data:", e);
    process.exit(1);
  }
}

cleanDemoQuestions();
