# X-Press Publishing API

API RESTful construida con **Express.js** y **SQLite3** para gestionar artistas, series e issues de una editorial de cómics.

## 🚀 Tecnologías usadas
- [Express.js](https://expressjs.com/) – Servidor web
- [SQLite3](https://www.sqlite.org/) – Base de datos relacional
- [Body-Parser](https://www.npmjs.com/package/body-parser) – Middleware para parsear JSON
- [Morgan](https://www.npmjs.com/package/morgan) – Logger HTTP
- [Cors](https://www.npmjs.com/package/cors) – Cross-Origin Resource Sharing
- [Errorhandler](https://www.npmjs.com/package/errorhandler) – Manejo de errores

---

## 📂 Estructura del proyecto
```
capstone-project-1-x-press-publishing/
├── api/
│   ├── api.js           # Router principal
│   ├── artists.js       # CRUD de artistas
│   ├── series.js        # CRUD de series y montaje de issues
│   └── issues.js        # CRUD de issues
├── database.sqlite      # Base de datos
├── migration.js         # Script de creación de tablas
├── seed.js              # (opcional) Datos iniciales
├── server.js            # Servidor Express
└── test/                # Suite de tests de Codecademy
```

---

## ⚡ Instalación y configuración

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tuusuario/x-press-publishing.git
   cd x-press-publishing
   ```

2. Instala dependencias:
   ```bash
   npm install
   ```

3. Crea las tablas:
   ```bash
   node migration.js
   ```

4. (Opcional) Inserta datos de prueba:
   ```bash
   node seed.js
   ```

5. Inicia el servidor:
   ```bash
   node server.js
   ```
   Servirá en: `http://localhost:4000/api`

---

## 📌 Endpoints

### 🎨 **Artistas** (`/api/artists`)

| Método | Endpoint                  | Descripción                                 |
|--------|---------------------------|---------------------------------------------|
| GET    | `/api/artists`            | Lista artistas actualmente empleados        |
| GET    | `/api/artists/:artistId`  | Obtiene un artista por ID                   |
| POST   | `/api/artists`            | Crea un nuevo artista                       |
| PUT    | `/api/artists/:artistId`  | Actualiza datos de un artista               |
| DELETE | `/api/artists/:artistId`  | Marca al artista como no empleado (soft delete) |

---

### 📚 **Series** (`/api/series`)

| Método | Endpoint                 | Descripción                                  |
|--------|--------------------------|----------------------------------------------|
| GET    | `/api/series`            | Lista todas las series                       |
| GET    | `/api/series/:seriesId`  | Obtiene una serie por ID                     |
| POST   | `/api/series`            | Crea una nueva serie                         |
| PUT    | `/api/series/:seriesId`  | Actualiza datos de una serie                 |
| DELETE | `/api/series/:seriesId`  | Elimina serie si no tiene issues asociadas   |

---

### 🗞️ **Issues** (`/api/series/:seriesId/issues`)

| Método | Endpoint                                       | Descripción                           |
|--------|------------------------------------------------|---------------------------------------|
| GET    | `/api/series/:seriesId/issues`                 | Lista issues de una serie             |
| POST   | `/api/series/:seriesId/issues`                 | Crea una nueva issue para una serie   |
| PUT    | `/api/series/:seriesId/issues/:issueId`        | Actualiza una issue existente         |
| DELETE | `/api/series/:seriesId/issues/:issueId`        | Elimina una issue existente           |

---

## 🧪 Ejemplos de uso con `curl`

### Crear un nuevo artista
```bash
curl -X POST http://localhost:4000/api/artists \
-H "Content-Type: application/json" \
-d '{"artist":{"name":"Nuevo Artista","dateOfBirth":"1990-05-10","biography":"Biografía","isCurrentlyEmployed":1}}'
```

### Crear una nueva serie
```bash
curl -X POST http://localhost:4000/api/series \
-H "Content-Type: application/json" \
-d '{"series":{"name":"Serie Ejemplo","description":"Descripción de prueba"}}'
```

### Crear una nueva issue
```bash
curl -X POST http://localhost:4000/api/series/1/issues \
-H "Content-Type: application/json" \
-d '{"issue":{"name":"Issue 1","issueNumber":1,"publicationDate":"2025-01-01","artistId":1}}'
```

---

## ✅ Tests
El proyecto incluye un set de tests automáticos. Para correrlos:
```bash
npm test
```
Si todo está correctamente implementado, **todos los tests deberían pasar**.

---

## 🏆 Estado del proyecto
✔ 100% completado – todas las funcionalidades y tests pasan correctamente.  
✔ Listo para usar como ejemplo en tu portafolio.

---

## ✨ Autor
**Diego Espinosa (Ghost)** – [Tu GitHub](https://github.com/cloecoding)
