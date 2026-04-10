const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:majba%4012345%23%23%23@db.kmngsroternvpzxefjxb.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => {
    console.log('Connected directly to db.* !');
    client.end();
  })
  .catch(err => {
    console.error('Connection error directly db.*:', err.message);
    client.end();
  });
