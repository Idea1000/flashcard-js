# 📚 Flashcards API
RESTful API for spaced repetition learning

---

## 🚀 Description

The **Flashcards API** is a RESTful backend built with **Node.js** and **Express**.  
It allows users to create flashcard collections, manage cards, and revise them using a **spaced repetition system**.

The API handles:
- authentication and authorization
- public and private collections
- flashcard revision logic
- admin-only user management

No frontend is required. This project focuses exclusively on backend architecture.

---

## 🛠️ Technologies

- Node.js
- Express
- SQLite (`@libsql/client`)
- Drizzle ORM
- Zod (validation)
- bcrypt (password hashing)
- jsonwebtoken (JWT)
- dotenv

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/flashcards-api.git
cd flashcards-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Use .env.exemple to create your own .env

### 4. Initialize the database

#### Push the database

```bash
npm run db:push
```

#### Seed the database

```bash
npm run db:seed
```

#### See the database with Drizzle Studio

```bash
npm run db:studio
```

### 5. Run the API

```bash
npm run dev
```

and that all. API available at:

```arduino
http://localhost:3000
```

---

## 🔐 Authentication

Authentication is handled with JWT.

For protected routes, include the token in headers:

```http
Authorization: Bearer <your_token>
```

---

## 📍 API Endpoints

---

### 🔑 Authentication

| Method | Endpoint | Description | Access |
|------|----------|-------------|--------|
| POST | `/auth/register` | Register a new user | Public |
| POST | `/auth/login` | Authenticate a user and return a JWT | Public |

---

### 🗂️ Collections

All collection routes require authentication.

| Method | Endpoint | Description |
|------|----------|------------|
| GET | `/collections` | Retrieve personal collections |
| GET | `/collections/:id` | Retrieve a collection by ID |
| GET | `/collections/public` | Retrieve all public collections |
| GET | `/collections/public/:name` | Search public collections by name |
| PUT | `/collections/:id` | Update an existing collection |
| POST | `/collections` | Create a new collection |
| DELETE | `/collections/:id` | Delete a collection |

**Collection body**
```json
{
  "title": "Biology",
  "description": "Human anatomy",
  "visibility": "public | private"
}
```

### 📝 Flashcards

All flashcard routes require authentication.

| Method | Endpoint                                             | Description                           |
| ------ | ---------------------------------------------------- | ------------------------------------- |
| POST   | `/flashcards`                                        | Create a flashcard                    |
| GET    | `/flashcards/:id`                                    | Retrieve a flashcard by ID            |
| GET    | `/flashcards/collection/:collectionId`               | Retrieve flashcards from a collection |
| GET    | `/flashcards/collection/:collectionId/revisions/due` | Retrieve flashcards due for revision  |
| PUT    | `/flashcards/:id`                                    | Update a flashcard                    |
| DELETE | `/flashcards/:id`                                    | Delete a flashcard                    |
| POST   | `/flashcards/:flashcardId/revise`                    | Revise a flashcard                    |


**Flashcard request body**
```json

{
  "frontText": "What is a neuron?",
  "backText": "A nerve cell",
  "frontUrl": null,
  "backUrl": null,
  "collection_id": 1
}
```

### 👤 Users (Admin only)

All user endpoints require authentication and admin privileges.

| Method | Endpoint     | Description      |
| ------ | ------------ | ---------------- |
| GET    | `/users`     | Get all users    |
| GET    | `/users/:id` | Get a user by ID |
| DELETE | `/users/:id` | Delete a user    |

---

## ⏳ Spaced Repetition System

Flashcards are organized into 5 levels:

| Level | Next review |
| ----- | ----------- |
| 1     | 1 day       |
| 2     | 2 days      |
| 3     | 4 days      |
| 4     | 8 days      |
| 5     | 16 days     |

Each revision updates:
- repetition level
- last review date
- next review date

---

## ✅ Validation & Access Control

- Request body and params validation with Zod
- Passwords hashed using bcrypt
- JWT-based authentication
- Admin-only routes protected by middleware
- Private collections accessible only by their owner

---

<div align="center">Made with 💚 in <strong>REST</strong> & 🧠 by passionate devs 🚀</div>