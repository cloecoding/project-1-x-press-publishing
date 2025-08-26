const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorhandler = require('errorhandler');
const morgan = require('morgan');
const path = require('path'); // ✅ añadimos path para rutas absolutas

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(errorhandler());
app.use(morgan('dev'));

// ✅ Importar router principal de API con ruta absoluta
const apiRouterPath = path.join(__dirname, 'api', 'api.js');
console.log('>> Cargando router desde:', apiRouterPath);
const apiRouter = require(apiRouterPath);

console.log('>> apiRouter importado correctamente');

// ✅ Montar router en /api
app.use('/api', apiRouter);
console.log('>> apiRouter montado en /api');

// ✅ Ruta raíz (landing/health)
app.get('/', (_req, res) => {
  res
    .status(200)
    .send('X-Press Publishing API ✅ — Prueba /api/artists o /api/series');
});

app.get('/healthz', (_req, res) => {
  res.status(200).json({ ok: true });
});

// ✅ Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

module.exports = app;
