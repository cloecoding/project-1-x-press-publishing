const express = require('express');
const sqlite3 = require('sqlite3');

const path = process.env.TEST_DATABASE || './database.sqlite';
const db = new sqlite3.Database(path);

// ✅ mergeParams: true para acceder a seriesId desde el parent router
const issuesRouter = express.Router({ mergeParams: true });

console.log('>> issues.js cargado correctamente');

// ✅ Paso 48: GET /api/series/:seriesId/issues
issuesRouter.get('/', (req, res, next) => {
  const sql = 'SELECT * FROM Issue WHERE series_id = $seriesId';
  const values = { $seriesId: req.params.seriesId };

  db.all(sql, values, (err, issues) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json({ issues: issues });
    }
  });
});

// ✅ Paso 49: POST /api/series/:seriesId/issues
issuesRouter.post('/', (req, res, next) => {
  const newIssue = req.body.issue;

  // Validación de campos requeridos
  if (!newIssue || !newIssue.name || !newIssue.issueNumber || !newIssue.publicationDate || !newIssue.artistId) {
    return res.status(400).send();
  }

  // Verificar que el artista existe
  db.get('SELECT * FROM Artist WHERE id = $artistId', { $artistId: newIssue.artistId }, (err, artist) => {
    if (err) {
      return next(err);
    } else if (!artist) {
      return res.status(400).send();
    } else {
      // Insertar nueva issue
      const sql = `
        INSERT INTO Issue (name, issue_number, publication_date, artist_id, series_id)
        VALUES ($name, $issueNumber, $publicationDate, $artistId, $seriesId)
      `;
      const values = {
        $name: newIssue.name,
        $issueNumber: newIssue.issueNumber,
        $publicationDate: newIssue.publicationDate,
        $artistId: newIssue.artistId,
        $seriesId: req.params.seriesId
      };

      db.run(sql, values, function (err) {
        if (err) {
          return next(err);
        }
        db.get('SELECT * FROM Issue WHERE id = $id', { $id: this.lastID }, (err, issue) => {
          if (err) {
            next(err);
          } else {
            res.status(201).json({ issue: issue });
          }
        });
      });
    }
  });
});

// ✅ Paso 50: router.param para :issueId
issuesRouter.param('issueId', (req, res, next, issueId) => {
  const sql = 'SELECT * FROM Issue WHERE id = $issueId';
  const values = { $issueId: issueId };

  db.get(sql, values, (err, issue) => {
    if (err) {
      next(err);
    } else if (issue) {
      req.issue = issue;
      next();
    } else {
      res.status(404).send();
    }
  });
});

// ✅ Paso 51: PUT /api/series/:seriesId/issues/:issueId
issuesRouter.put('/:issueId', (req, res, next) => {
  const updatedIssue = req.body.issue;

  // Validación de campos requeridos
  if (!updatedIssue || !updatedIssue.name || !updatedIssue.issueNumber || !updatedIssue.publicationDate || !updatedIssue.artistId) {
    return res.status(400).send();
  }

  // Verificar que el artista existe
  db.get('SELECT * FROM Artist WHERE id = $artistId', { $artistId: updatedIssue.artistId }, (err, artist) => {
    if (err) {
      return next(err);
    } else if (!artist) {
      return res.status(400).send();
    } else {
      // Actualizar la issue
      const sql = `
        UPDATE Issue
        SET name = $name,
            issue_number = $issueNumber,
            publication_date = $publicationDate,
            artist_id = $artistId,
            series_id = $seriesId
        WHERE id = $issueId
      `;
      const values = {
        $name: updatedIssue.name,
        $issueNumber: updatedIssue.issueNumber,
        $publicationDate: updatedIssue.publicationDate,
        $artistId: updatedIssue.artistId,
        $seriesId: req.params.seriesId,
        $issueId: req.params.issueId
      };

      db.run(sql, values, function (err) {
        if (err) {
          return next(err);
        }
        db.get('SELECT * FROM Issue WHERE id = $id', { $id: req.params.issueId }, (err, issue) => {
          if (err) {
            next(err);
          } else {
            res.status(200).json({ issue: issue });
          }
        });
      });
    }
  });
});

// ✅ Paso 52: DELETE /api/series/:seriesId/issues/:issueId
issuesRouter.delete('/:issueId', (req, res, next) => {
  const sql = 'DELETE FROM Issue WHERE id = $issueId';
  const values = { $issueId: req.params.issueId };

  db.run(sql, values, function (err) {
    if (err) {
      next(err);
    } else {
      res.sendStatus(204); // No content
    }
  });
});

module.exports = issuesRouter;
