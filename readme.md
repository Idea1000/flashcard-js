# 📚 Flashcards API
RESTful API for spaced repetition learning

---

## 🚀 Description

The **Flashcards API** is a RESTful backend built with **Node.js** and **Express**.  
It allows users to create flashcard collections, manage cards, and revise them using a **spaced repetition system**.

The API handles:
- authentication and authorization
- public, private and draw collections
- flashcard review logic
- admin-only user management

No frontend is included. This project focuses exclusively on backend architecture.

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
http://localhost:3000 (by default)
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
|------|------------------|--------------------------------------|-----------|
| GET  | `/auth/info`     | Recover connected (JWT) user info    | Connected |
| POST | `/auth/register` | Register a new user                  | Public    |
| POST | `/auth/login`    | Authenticate a user and return a JWT | Public    |

**Register body**
```json
{
  "email": {str},
  "password": {str} <=== 8 characters minimum),
  "firstname": {str},
  "name": {str}
}
```

**Login body**
```json
{
  "email": {str},
  "password": {str} (<=== 8 characters minimum),
}
```

---

### 🗂️ Collections

All collection routes require authentication.

| Method | Endpoint                    | Description                       | Access    |
|--------|-----------------------------|-----------------------------------| --------- |
| GET    | `/collections`              | Retrieve personal collections     | Connected |
| GET    | `/collections/:id`          | Retrieve a collection by ID       | Connected |
| GET    | `/collections/draw`         | Retrieve personal draw collections| Connected |
| GET    | `/collections/draw/:id`     | Retrieve a draw collection by ID  | Connected |
| GET    | `/collections/public`       | Retrieve all public collections   | Connected |
| GET    | `/collections/public/:name` | Search public collections by name | Connected |
| GET    | `/collections/admin/`       | Retrieve all collections          | Admin     |
| POST   | `/collections`              | Create a new collection           | Connected |
| POST   | `/collections/:id/copy`     | Copy a public collection          | Connected |
| PUT    | `/collections/:id`          | Update an existing collection     | Connected |
| DELETE | `/collections/:id`          | Delete a collection (owned only)  | Connected |
| DELETE | `/collections/admin/:id`    | Delete a collection (any)         | Admin     |

**Create collection body**
```json
{
  "title": {str},
  ["description": {str},]
  "visibility": "PUBLIC | PRIVATE | DRAW"
}
```

**Update and Copy collection body**
```json
{
  ["title": {str}],
  ["description": {str},]
  ["visibility": "PUBLIC | PRIVATE | DRAW"]
}
```

### 📝 Flashcards

All flashcard routes require authentication.

| Method | Endpoint                                             | Description                           | Access    |
| ------ | ---------------------------------------------------- | ------------------------------------- | --------- |
| GET    | `/flashcards/:id`                                    | Retrieve a flashcard by ID            | Connected |
| GET    | `/flashcards/collection/:collectionId`               | Retrieve flashcards from a collection | Connected |
| GET    | `/flashcards/collection/:collectionId/revisions/due` | Retrieve flashcards due for review  | Connected |
| POST   | `/flashcards`                                        | Create a flashcard                    | Connected |
| POST   | `/flashcards/:flashcardId/revise`                    | Revise a flashcard                    | Connected |
| PUT    | `/flashcards/:id`                                    | Update a flashcard                    | Connected |
| DELETE | `/flashcards/:id`                                    | Delete a flashcard                    | Connected |

#### Flashcard request body
**Flashcard creation body**
```json

{
  "frontText": "What is a neuron?",
  "backText": "A nerve cell",
  "collection_id": 1
  ["frontUrl": null,
  "backUrl": null] OPTIONNAL
}
```

**Flashcard update body**
```json

{
  ["frontText": "What is a neuron?",
  "backText": "A nerve cell",
  "frontUrl": null,
  "backUrl": null] OPTIONNAL
}
```


**Flashcard revise creation/update body**
```json
{
  "newLevel": 1
}
```

### 👤 Users (Admin only)

All user endpoints require authentication and admin privileges.

| Method | Endpoint             | Description             | Access |
| ------ | -------------------- | ----------------------- | -----  |
| GET    | `/users`             | Get all users           | Admin  |
| GET    | `/users/:id`         | Get a user by ID        | Admin  |
| PUT    | `/users/promote/:id` | Promote user admin role | Admin  |
| DELETE | `/users/:id`         | Delete a user           | Admin  |

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

Each review updates:
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

## Author

- [BRAULT Matheo](https://github.com/Idea1000)
- [LAZARRE Louis](https://github.com/SoulLikePlayer)
- [THEAULT Hugo](https://github.com/hugotheault)

<div align="center">Made with 💚 in <strong>JavaScript</strong> & 🧠 by passionate devs 🚀</div>