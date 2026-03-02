require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { neon } = require('@neondatabase/serverless');

const app = express();
const PORT = process.env.PORT || 4242;
const sql = neon(`${process.env.DATABASE_URL}`);

app.use(cors());
app.use(express.json());

// ID du usuario de referencia (hasta implementar autenticación)
const CURRENT_USER_ID = '44360181-1cbf-4a49-ac4c-af815a001ae1';

// ══════════════════════════════════════════════
// ROUTES : AUDIO_PIN & USER
// ══════════════════════════════════════════════

app.get('/pins', async (_, res) => {
  const pins = await sql`SELECT * FROM audio_pin`;
  res.json({ pins });
});

app.get('/users', async (_, res) => {
  const users = await sql`SELECT * FROM "user"`;
  res.json({ users });
});

// OBTAIN A USER BY THEIR ID
app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql`SELECT * FROM "user" WHERE id = ${id}`;
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }
    res.json({ user: result[0] });
  } catch (error) {
    console.error('Erreur GET /users/:id', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// OBTAIN EVERY PIN LINKED TO A USER
app.get('/users/:id/pins', async (req, res) => {
  try {
    const { id } = req.params;
    const pins = await sql`SELECT * FROM audio_pin WHERE user_id = ${id} ORDER BY id DESC`;
    res.json({ pins });
  } catch (error) {
    console.error('Erreur GET /users/:id/pins', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ══════════════════════════════════════════════
// ROUTE POST : AJOUTER UN NOUVEAU PIN / FOR POSTING A NEW PIN
// ══════════════════════════════════════════════

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
    } = req.body;

    // AUTEUR = USERNAME -> NO NEED TO PUT THIS FIELD IN THE FORM
    const userResult = await sql`SELECT username FROM "user" WHERE id = ${CURRENT_USER_ID}`;
    const author_name = userResult[0]?.username ?? 'gabhono';

    if (!title || !latitude || !longitude || !audio_url || !location_name || !inspiration_text) {
      return res.status(400).json({
        success: false,
        message: 'Champs obligatoires: title, latitude, longitude, audio_url, location_name, inspiration_text'
      });
    }

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
        ${location_name}, ${inspiration_text}, ${technology ?? null}, ${author_name}, ${CURRENT_USER_ID}
      )
      RETURNING *
    `;

    console.log(`Nouveau pin "${result[0].title}" (id: ${result[0].id}) ajouté`);
    res.status(201).json({ success: true, data: result[0] });

  } catch (error) {
    console.error("Erreur POST /nouveaupin:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ══════════════════════════════════════════════
// ROUTE PUT : MODIFIER UN PIN / MODIFYING A PIN
// ══════════════════════════════════════════════

app.put('/pins/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      latitude,
      longitude,
      audio_url,
      location_name,
      inspiration_text,
      technology,
    } = req.body;

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ success: false, message: 'Coordonnées invalides' });
    }

    const result = await sql`
      UPDATE audio_pin SET
        title            = ${title},
        latitude         = ${lat},
        longitude        = ${lon},
        audio_url        = ${audio_url},
        location_name    = ${location_name},
        inspiration_text = ${inspiration_text},
        technology       = ${technology ?? null}
      WHERE id = ${id} AND user_id = ${CURRENT_USER_ID}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Pin non trouvé ou accès refusé' });
    }

    console.log(`Pin "${result[0].title}" (id: ${id}) mis à jour`);
    res.json({ success: true, data: result[0] });

  } catch (error) {
    console.error('Erreur PUT /pins/:id', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ══════════════════════════════════════════════
// ROUTE DELETE : SUPPRIMER UN PIN
// ══════════════════════════════════════════════

app.delete('/pins/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await sql`
      DELETE FROM audio_pin
      WHERE id = ${id} AND user_id = ${CURRENT_USER_ID}
      RETURNING id, title
    `;

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Pin non trouvé ou accès refusé' });
    }

    console.log(`Pin "${result[0].title}" (id: ${id}) supprimé`);
    res.json({ success: true, message: `"${result[0].title}" supprimé avec succès` });

  } catch (error) {
    console.error('Erreur DELETE /pins/:id', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ══════════════════════════════════════════════
// ROUTES FAVORIS
// ══════════════════════════════════════════════

// GET USER'S FAVORITES WITH THE DETAILS OF THE PIN
app.get('/users/:id/favoris', async (req, res) => {
  try {
    const { id } = req.params;
    const favoris = await sql`
      SELECT ap.*, f.id as favori_id
      FROM favoris f
      JOIN audio_pin ap ON f.pin_id = ap.id
      WHERE f.user_id = ${id}
      ORDER BY f.id DESC
    `;
    res.json({ favoris });
  } catch (error) {
    console.error('Erreur GET /users/:id/favoris', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

//ADD A PIN TO THE FAVORITES LIST
app.post('/favoris', async (req, res) => {
  try {
    const { pin_id } = req.body;

    if (!pin_id) {
      return res.status(400).json({ success: false, message: 'pin_id requis' });
    }

    //VERIFY IF TH PIN EXISTS
    const existing = await sql`
      SELECT id FROM favoris WHERE user_id = ${CURRENT_USER_ID} AND pin_id = ${pin_id}
    `;

    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Déjà en favoris' });
    }

    const result = await sql`
      INSERT INTO favoris (user_id, pin_id)
      VALUES (${CURRENT_USER_ID}, ${pin_id})
      RETURNING *
    `;

    res.status(201).json({ success: true, data: result[0] });

  } catch (error) {
    console.error('Erreur POST /favoris', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

//DELETE A PIN FROM THE FAVORITES LIST
app.delete('/favoris/:pin_id', async (req, res) => {
  try {
    const { pin_id } = req.params;

    const result = await sql`
      DELETE FROM favoris
      WHERE user_id = ${CURRENT_USER_ID} AND pin_id = ${pin_id}
      RETURNING id
    `;

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Favori non trouvé' });
    }

    res.json({ success: true, message: 'Retiré des favoris' });

  } catch (error) {
    console.error('Erreur DELETE /favoris/:pin_id', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ══════════════════════════════════════════════
// CONFIGURATION GÉNÉRALE
// ══════════════════════════════════════════════

app.get('/', async (_, res) => {
  const response = await sql`SELECT version()`;
  const { version } = response[0];
  res.json({ version });
});

app.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT}`);
});