require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { neon } = require('@neondatabase/serverless');

const app = express();
const PORT = process.env.PORT || 4242;
const sql = neon(`${process.env.DATABASE_URL}`);

app.use(cors());
app.use(express.json());

//ROUTES POUR OBTENIR DONÉES DES TABLES "AUDIO_PIN" ET "USER"
app.get('/pins', async (_, res)=> {
    const pins = await sql`SELECT * FROM audio_pin`;
    res.json({pins});
})

app.get('/users', async (_, res)=> {
    const users = await sql`SELECT * FROM "user"`;
    res.json({users});
})

//ROUTE POST POUR AJOUTER UN NOUVEAU PIN DANS LE MAP (TABLE AUDIO_PIN)
app.post('/nouveaupin', async (req, res) => {
  try {
    const {
      title,
      latitude,
      longitude,
      audio_url,
      location_name,
      inspiration_text,
      technology,
      author_name
    } = req.body;

    // On force l'id d'usager en tant qu'on travaille pas l'authentification
    const user_id = '44360181-1cbf-4a49-ac4c-af815a001ae1';

    if (!title || !latitude || !longitude || !audio_url || !location_name || !inspiration_text || !author_name) {
      return res.status(400).json({
        success: false,
        message: 'Champs obligatoires: title, latitude, longitude, audio_url, location_name, inspiration_text, author_name'
      });
    }
    //On assure que champs (latitude) et (longitude) soient des nombres
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({
        success: false,
        message: 'latitude et longitude doivent être des nombres valides'
      });
    }

    const result = await sql`
      INSERT INTO audio_pin (
        title, latitude, longitude, audio_url,
        location_name, inspiration_text, technology, author_name, user_id
      )
      VALUES (
        ${title}, ${lat}, ${lon}, ${audio_url},
        ${location_name}, ${inspiration_text}, ${technology ?? null}, ${author_name}, ${user_id}
      )
      RETURNING *
    `;

    console.log(`Nouveau pin "${result[0].title}" (id: ${result[0].id}) ajouté avec succès`);

    res.status(201).json({
      success: true,
      message: `Audio "${result[0].title}" ajouté avec succès`,
      data: result[0]
    });

  } catch (error) {
    console.error(`Erreur lors de l'ajout:`, error);
    res.status(500).json({
      success: false,
      message: `Erreur lors de l'ajout`,
      error: error.message
    });
  }
});

//CONFIGURATION GÉNÉRALE
app.get('/', async (_, res) => {
  const response = await sql`SELECT version()`;
  const { version } = response[0];
  res.json({ version });
});

app.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT}`);
});