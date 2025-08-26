const express = require('express');
const path = require('path');
const apiRouter = express.Router();

console.log('>> api.js cargado correctamente');

const artistsRouter = require('./artists');
apiRouter.use('/artists', artistsRouter);

// ✅ Paso 38: montar seriesRouter
const seriesRouter = require('./series');
apiRouter.use('/series', seriesRouter);

module.exports = apiRouter;
