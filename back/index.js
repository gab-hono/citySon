require('dotenv').config();

const express = require('express');
const { neon } = require('@neondatabase/serverless');

const app = express();
const PORT = process.env.PORT || 4242;
const sql = neon(`${process.env.DATABASE_URL}`);

app.use(express.json());

app.get('/pins', async (_, res)=> {
    const pins = await sql`SELECT * FROM audio_pin`;
    res.json({pins});
})

app.get('/users', async (_, res)=> {
    const users = await sql`SELECT * FROM "user"`;
    res.json({users});
})

app.get('/', async (_, res) => {
  const response = await sql`SELECT version()`;
  const { version } = response[0];
  res.json({ version });
});

app.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT}`);
});