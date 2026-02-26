# 💬 Real-Time Chat Application with Secure Code Execution

## 📌 Project Description

This project is a **real-time chat application with integrated secure code execution**, designed to enable developers to communicate, share code snippets, and execute programs safely within isolated Docker containers.

The platform combines **real-time messaging** with an **interactive code editor**, allowing users to:

- 💬 Chat in real-time within rooms  
- 💻 Write and share code snippets  
- ▶️ Execute code securely in a sandboxed environment  
- 📜 View execution output instantly  
- 🗄 Store chat history and code results in a SQL database  
- 🔐 Access the platform via JWT-based authentication  

The system ensures security by running user-submitted code inside **ephemeral Docker containers** with strict CPU and memory limits, preventing malicious or resource-intensive operations.

---

## 🎯 Use Cases

This architecture makes the platform suitable for:

- 👨‍💻 Coding interviews  
- 🧑‍🏫 Online coding classrooms  
- 🏆 Competitive coding battles  
- 🤝 Collaborative development sessions  

---

# 🏗 System Architecture Overview

The application follows a **full-stack client-server architecture**:

---

## 1️⃣ Frontend (React)

- User authentication (Login/Register)
- Real-time chat interface
- Code editor component
- Live execution output display
- Socket.io integration for instant communication

---

## 2️⃣ Backend (Node.js + Express)

- REST APIs for authentication & history
- JWT middleware for security
- Socket.io server for real-time communication
- Code execution controller
- Docker orchestration for sandboxed execution

---

## 3️⃣ Database (SQL via Sequelize ORM)

- Users table  
- Chat Rooms table  
- Messages table  
- Code Snippets table  
- Execution Results table  

---

## 4️⃣ Docker Sandbox

- Ephemeral containers  
- Strict CPU and memory limits  
- No host-level code execution  
- Captures stdout & stderr  
- Automatic cleanup after execution  

---

# 🛠 Tech Stack

## 🎨 Frontend

- React.js  
- Socket.io-client  
- Axios  
- Monaco Editor / CodeMirror  
- CSS / Tailwind (optional)  

---

## ⚙ Backend

- Node.js  
- Express.js  
- Socket.io  
- Sequelize ORM  
- JWT (jsonwebtoken)  
- bcrypt (Password hashing)  
- child_process (Docker spawning)  

---

## 🗄 Database

- MySQL / PostgreSQL  
- Managed via Sequelize ORM  

---

## 🐳 DevOps & Security

- Docker  
- Resource-limited containers  
- JWT Authentication  
- Input validation  
- Execution timeouts  

---

# 🔐 Security Highlights

- 🔒 JWT-based authentication
- 🔑 Encrypted passwords using bcrypt
- 🐳 Sandboxed execution using Docker
- ⏱ Execution time limits
- 💾 Resource limits (CPU & Memory)
- 🚫 No direct host system access

---

# 🚀 Key Features Summary

| Feature | Description |
|----------|------------|
| Real-time Chat | Instant messaging using Socket.io |
| Code Editor | Interactive editor with syntax highlighting |
| Secure Execution | Code runs in isolated Docker containers |
| Persistent Storage | Chat & execution history stored in SQL |
| Authentication | JWT-secured user sessions |
| Scalable Architecture | Modular full-stack design |

---

# 📈 Future Enhancements

- 🔄 Multiple programming language support  
- 🏅 Leaderboard & scoring system  
- 📹 Video/voice chat integration  
- 🌐 Deployment with Kubernetes  
- 📊 Execution analytics dashboard  

---

## 🏁 Conclusion

This project delivers a **secure, scalable, and developer-focused platform** that combines communication and code execution into a single collaborative environment. It is ideal for educational platforms, interview systems, and competitive programming applications.