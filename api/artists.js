const express = require('express');
const sqlite3 = require('sqlite3');

const path = process.env.TEST_DATABASE || './database.sqlite';
const db = new sqlite3.Database(path);

const artistsRouter = express.Router();

console.log('>> artists.js cargado correctamente');

// ✅ Paso 24-26: router param para :artistId
artistsRouter.param('artistId', (req, res, next, artistId) => {
  console.log(`>> Param artistId recibido: ${artistId}`);
  const sql = 'SELECT * FROM Artist WHERE id = $artistId';
  const values = { $artistId: artistId };

  db.get(sql, values, (err, artist) => {
    if (err) {
      next(err);
    } else if (artist) {
      req.artist = artist;
      next();
    } else {
      res.status(404).send();
    }
  });
});

// ✅ GET /api/artists
artistsRouter.get('/', (req, res, next) => {
  const sql = 'SELECT * FROM Artist WHERE is_currently_employed = 1';
  db.all(sql, (err, rows) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json({ artists: rows });
    }
  });
});

// ✅ GET /api/artists/:artistId
artistsRouter.get('/:artistId', (req, res, next) => {
  res.status(200).json({ artist: req.artist });
});

// ✅ POST /api/artists
artistsRouter.post('/', (req, res, next) => {
  const newArtist = req.body.artist;

  if (!newArtist || !newArtist.name || !newArtist.dateOfBirth || !newArtist.biography) {
    return res.status(400).send();
  }

  const isCurrentlyEmployed = newArtist.isCurrentlyEmployed === 0 ? 0 : 1;

  const sql = `
    INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed)
    VALUES ($name, $dateOfBirth, $biography, $isCurrentlyEmployed)
  `;
  const values = {
    $name: newArtist.name,
    $dateOfBirth: newArtist.dateOfBirth,
    $biography: newArtist.biography,
    $isCurrentlyEmployed: isCurrentlyEmployed
  };

  db.run(sql, values, function (err) {
    if (err) {
      return next(err);
    }
    db.get('SELECT * FROM Artist WHERE id = $id', { $id: this.lastID }, (err, artist) => {
      if (err) {
        next(err);
      } else {
        res.status(201).json({ artist: artist });
      }
    });
  });
});

// ✅ PUT /api/artists/:artistId
artistsRouter.put('/:artistId', (req, res, next) => {
  const updatedArtist = req.body.artist;

  if (!updatedArtist || !updatedArtist.name || !updatedArtist.dateOfBirth || !updatedArtist.biography) {
    return res.status(400).send();
  }

  const isCurrentlyEmployed = updatedArtist.isCurrentlyEmployed === 0 ? 0 : 1;

  const sql = `
    UPDATE Artist
    SET name = $name,
        date_of_birth = $dateOfBirth,
        biography = $biography,
        is_currently_employed = $isCurrentlyEmployed
    WHERE id = $artistId
  `;
  const values = {
    $name: updatedArtist.name,
    $dateOfBirth: updatedArtist.dateOfBirth,
    $biography: updatedArtist.biography,
    $isCurrentlyEmployed: isCurrentlyEmployed,
    $artistId: req.params.artistId
  };

  db.run(sql, values, function (err) {
    if (err) {
      return next(err);
    }
    db.get('SELECT * FROM Artist WHERE id = $id', { $id: req.params.artistId }, (err, artist) => {
      if (err) {
        next(err);
      } else {
        res.status(200).json({ artist: artist });
      }
    });
  });
});

// ✅ Paso 35: DELETE /api/artists/:artistId
artistsRouter.delete('/:artistId', (req, res, next) => {
  const sql = `
    UPDATE Artist
    SET is_currently_employed = 0
    WHERE id = $artistId
  `;
  const values = { $artistId: req.params.artistId };

  db.run(sql, values, function (err) {
    if (err) {
      return next(err);
    }

    // Recuperar el artista actualizado
    db.get('SELECT * FROM Artist WHERE id = $id', { $id: req.params.artistId }, (err, artist) => {
      if (err) {
        next(err);
      } else {
        res.status(200).json({ artist: artist });
      }
    });
  });
});


module.exports = artistsRouter;
