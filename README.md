# Secure Notes Vault

Secure Notes Vault is a small full-stack app (MERN-style) that allows users to store encrypted notes, share them with other users (READ/WRITE permissions), and track actions via an audit timeline.

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

