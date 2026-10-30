# Lifeline 360

An integrated healthcare platform: ambulance booking, nursing and caretakers,
medicine delivery, laboratory tests and blood bank requests in one ecosystem,
with membership, multi-language support and calling support (see the Scope of
Work in `tools/`).

**Current phase:** the public website (`frontend/`). The backend is still the
starter API (auth + users) and will grow with the apps and panels.

---

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, React Router v7, Tailwind CSS v4, Motion, React Hook Form + Zod, lucide-react icons
- **Backend**: Node.js, Express (ES Modules), MongoDB & Mongoose, JWT auth, Zod, Helmet, CORS, rate limiting, Nodemailer

---

## 🚀 Quick Start

### Website (frontend)
```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
```
See `frontend/README.md` for routes, structure, the design system and what to
replace before launch.

### API (backend)
```bash
cd backend
npm install
npm run seed     # seeds a default admin and demo user
npm run dev      # http://localhost:5000
```

Seeded accounts (development only): `admin@example.com` / `Admin@123456` and
`user@example.com` / `User@123456`.

---

## 🔒 Security note

The starter template this project was created from contained hidden malicious
code (an obfuscated payload appended to `frontend/vite.config.js` and a
`backend/api.js` that the `dev`/`start` scripts ran first). Both were removed on
22 October 2026, the `node_modules` folders were reinstalled from the
lockfiles, and the scripts now start the real server directly. Do not restore
files from the original template.

---

## 📁 Project Structure

```text
├── backend/                 Starter Express REST API & MongoDB models
├── frontend/                Public marketing and services website (Vite + React)
├── user-app/                Lifeline 360 Customer Native Mobile App (React Native CLI)
├── driver-app/              Lifeline 360 Ambulance & Driver Native Mobile App (React Native CLI)
│   ├── src/                 Theme, store, emergency workflow, navigation, screens
│   └── release/             Signed release APK (Lifeline360-Driver-1.0.0.apk)
├── docs/                    Engineering documentation & playbooks
│   ├── NATIVE-APP-PLAYBOOK.md
│   └── DRIVER-APP-PLAN.md
└── tools/                   Scope of Work specifications
```
