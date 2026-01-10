# Secure Notes Vault

Secure Notes Vault is a small full-stack app (MERN-style) that allows users to store encrypted notes, share them with other users (READ/WRITE permissions), and track actions via an audit timeline.

## Live Project Link: https://secure-note-vault-frontend.onrender.com

## Project structure

- `backend/` - Express API
  - `src/` - source code
    - `controllers/` - request handlers
    - `models/` - mongoose models
    - `routes/` - express routes
    - `middleware/` - auth middleware
    - `config/` - db config

- `client/vite-project/` - React + Vite frontend
  - `src/` - application source

## Quick start (development)

Prerequisites
- Node.js 18+ and npm
- MongoDB (local or remote)

1. Backend

```bash
cd backend
# install
npm install
# copy .env.example -> .env and set MONGO_URI and JWT_SECRET
# run backend
npm run dev
```

2. Frontend

```bash
cd client/vite-project
npm install
npm run dev
# open http://localhost:5173 (port may vary)
```

## Environment variables (`backend/.env`)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - secret used for signing JWT tokens

## Backend - Setup & API docs

Overview

The backend provides authentication (register/login) and CRUD for encrypted notes with sharing and audit logging.

Quick start (backend)

1. Install dependencies

```bash
cd backend
npm install
npm install swagger-jsdoc swagger-ui-express
```

2. Create a `.env` in `backend/` with:

```
MONGO_URI=mongodb://localhost:27017/secure-notes
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=change_this_to_a_strong_secret
PORT=5000
```

3. Run the server

```bash
npm run dev
# or
npm start
```

4. API docs (Swagger UI): http://localhost:5000/api-docs

Postman collection

See `backend/postman_collection.json` for a basic collection you can import to test endpoints.

Hosting on GitHub

1. Create a new GitHub repo.
2. From the `backend` folder:

```bash
git init
git add .
git commit -m "Initial backend"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo>.git
git push -u origin main
```

Notes

- The app stores notes AES-encrypted using `ENCRYPTION_KEY`.
- Audit logs are kept in `AuditLog` collection.

Next steps you may want

- Add rate-limiting and input validation
- Add CI workflow and Dockerfile for deployment

## API (important endpoints)
- `POST /api/auth/register` - register a new user
- `POST /api/auth/login` - login (returns token)
- `POST /api/notes` - create note (auth)
- `GET /api/notes/my` - list your notes (auth)
- `GET /api/notes/shared` - notes shared with you (auth)
- `POST /api/notes/:id/share` - share a note with `usernameOrEmail` and `permission` (READ|WRITE) (auth)

## Notes about sharing
- Only the owner of a note may share it.
- Sharing payload: `{ usernameOrEmail: "bob@example.com", permission: "READ" }`.

## Troubleshooting
- If frontend shows 404 for `/api/...`, ensure backend is running at `http://localhost:5000` and `client/src/api/api.js` baseURL is correct.
- If authentication fails, ensure `JWT_SECRET` matches between environment and tokens in storage.

## Tests & Manual steps
1. Register two users (alice, bob).
2. Login as alice, create a note.
3. Share note with bob (READ or WRITE) using the Share modal.
4. Login as bob and check "Shared with me".

## License
MIT License

Copyright (c) 2026 Pratiksha Ankushrao

Permission is hereby granted, free of charge, to any person obtaining a copy
...


