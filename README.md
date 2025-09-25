# ETB Server (Engineering Tech Build)

**ETB Server** is a backend service built with **Node.js + Express.js + MongoDB** to manage engineering tech projects.  
It provides **RESTful APIs** for handling users, projects, tasks, and collaborations in a scalable and flexible way.  

---

## 📌 Features
- RESTful API for **users, projects, tasks, and collaborations**.  
- **JWT-based authentication** & role-based access control.  
- Modular Express.js project structure for easy scaling.  
- **MongoDB database** for flexible project data management.  
- Can be integrated with any front-end (React, Vue, Angular, etc.).  

---

## 🛠️ Tech Stack
- **Backend:** Node.js + Express.js  
- **Database:** MongoDB (Mongoose ODM)  
- **Authentication:** JWT  
- **Testing (optional):** Jest / Supertest  
- **Docs (optional):** Swagger / Postman  

---

##  Database Schema (MongoDB ERD-like Structure)

```mermaid
erDiagram
    USERS {
        ObjectId _id PK
        string name
        string email
        string password
        string role
    }
    PROJECTS {
        ObjectId  _id  PK
        string title
        string description
        date startDate
        date endDate
        ObjectId ownerId FK
    }
    TASKS {
        ObjectId _id PK
        string title
        string details
        string status
        ObjectId projectId FK
        ObjectId assignedTo FK
    }
    COLLABORATIONS {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId projectId FK
        string role
    }

    USERS ||--o{ PROJECTS : "owns"
    USERS ||--o{ TASKS : "assigned"
    PROJECTS ||--o{ TASKS : "has"
    USERS ||--o{ COLLABORATIONS : "joins"
    PROJECTS ||--o{ COLLABORATIONS : "invites"

---

# 📦 Requirements

###Make sure you have installed:

- Node.js
 v18+
|
- MongoDB
 (local or Atlas Cloud
)
|
- npm
 or yarn

---

## Clone repository
- git clone https://github.com/habyarimanacaleb/etb-server.git
- cd etb-server

#@ Install dependencies
- npm install

## Setup environment variables
 - cp .env.example .env

## Start development server
- npm run dev

---

##🔑 Environment Variables

- Create a .env file with:

- PORT=5000
- MONGO_URI=mongodb://localhost:27017/etb   # or Atlas connection string
- JWT_SECRET=your-secret-key

##  API Endpoints
### Method	Endpoint	Description
- POST	/api/auth/register	Register a new user
- POST	/api/auth/login	Login and get token
- GET	/api/projects	Fetch all projects
- POST	/api/projects	Create new project
- GET	/api/tasks/:id	Get task by ID
- POST	/api/tasks	Create new task
- GET	/api/collaborations	Get project collaborators
- POST	/api/collaborations	Add collaborator

## Extend with all endpoints you l’ve implemented

###🤝 Collaboration & Contribution

- We welcome contributions 🚀

- Fork the repository.

### Create a branch:

- git checkout -b feature-name

### Commit changes:

- git commit -m "Add feature X"


### Push to your fork:

- git push origin feature-name


### -Open a Pull Request.

-  If you have collaborator access, you can push branches directly and open PRs in the main repo.

---
 
Would you like me to also add a **section for Swagger/Postman API docs** so collaborators can easily test your REST APIs?

