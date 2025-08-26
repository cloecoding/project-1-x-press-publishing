const express = require('express');
const sqlite3 = require('sqlite3');

const path = process.env.TEST_DATABASE || './database.sqlite';
const db = new sqlite3.Database(path);

const seriesRouter = express.Router();

console.log('>> series.js cargado correctamente');

// ✅ Paso 41: router.param para :seriesId
seriesRouter.param('seriesId', (req, res, next, seriesId) => {
  const sql = 'SELECT * FROM Series WHERE id = $seriesId';
  const values = { $seriesId: seriesId };

  db.get(sql, values, (err, series) => {
    if (err) {
      next(err);
    } else if (series) {
      req.series = series;
      next();
    } else {
      res.status(404).send();
    }
  });
});

// ✅ Paso 40: GET /api/series (listar todas las series)
seriesRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Series', (err, rows) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json({ series: rows });
    }
  });
});

// ✅ Paso 42: GET /api/series/:seriesId (una serie específica)
seriesRouter.get('/:seriesId', (req, res, next) => {
  res.status(200).json({ series: req.series });
});

// ✅ Paso 43: POST /api/series (crear nueva serie)
seriesRouter.post('/', (req, res, next) => {
  const newSeries = req.body.series;

  if (!newSeries || !newSeries.name || !newSeries.description) {
    return res.status(400).send();
  }

  const sql = `
    INSERT INTO Series (name, description)
    VALUES ($name, $description)
  `;
  const values = {
    $name: newSeries.name,
    $description: newSeries.description
  };

  db.run(sql, values, function (err) {
    if (err) {
      return next(err);
    }
    db.get('SELECT * FROM Series WHERE id = $id', { $id: this.lastID }, (err, series) => {
      if (err) {
        next(err);
      } else {
        res.status(201).json({ series: series });
      }
    });
  });
});

// ✅ Paso 44: PUT /api/series/:seriesId (actualizar serie existente)
seriesRouter.put('/:seriesId', (req, res, next) => {
  const updatedSeries = req.body.series;

  if (!updatedSeries || !updatedSeries.name || !updatedSeries.description) {
    return res.status(400).send();
  }

  const sql = `
    UPDATE Series
    SET name = $name,
        description = $description
    WHERE id = $seriesId
  `;
  const values = {
    $name: updatedSeries.name,
    $description: updatedSeries.description,
    $seriesId: req.params.seriesId
  };

  db.run(sql, values, function (err) {
    if (err) {
      return next(err);
    }
    db.get('SELECT * FROM Series WHERE id = $id', { $id: req.params.seriesId }, (err, series) => {
      if (err) {
        next(err);
      } else {
        res.status(200).json({ series: series });
      }
    });
  });
});

// ✅ Importar y montar issuesRouter
const issuesRouter = require('./issues');
seriesRouter.use('/:seriesId/issues', issuesRouter);

// ✅ Paso 53: DELETE /api/series/:seriesId
seriesRouter.delete('/:seriesId', (req, res, next) => {
  const checkIssuesSql = 'SELECT * FROM Issue WHERE series_id = $seriesId';
  const values = { $seriesId: req.params.seriesId };

  db.get(checkIssuesSql, values, (err, issue) => {
    if (err) {
      next(err);
    } else if (issue) {
      // Si existe al menos una issue asociada → no eliminar
      res.sendStatus(400);
    } else {
      // Si no hay issues → eliminar la serie
      const deleteSql = 'DELETE FROM Series WHERE id = $seriesId';
      db.run(deleteSql, values, function (err) {
        if (err) {
          next(err);
        } else {
          res.sendStatus(204); // Eliminación exitosa sin contenido
        }
      });
    }
  });
});

module.exports = seriesRouter;
