require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(async () => {
    console.log('Connected directly to pooler!');
    const res = await client.query('SELECT id, title, "startTime", "endTime" FROM exams');
    console.log(res.rows);
    console.log("Current time (new Date()):", new Date());
    client.end();
  })
  .catch(err => {
    console.error('Connection error directly db.*:', err.message);
    client.end();
  });
