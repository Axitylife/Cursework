const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4000;

// Пути к файлам
const usersFilePath = path.join(__dirname, "users.json");
const ideasFilePath = path.join(__dirname, "ideas.json");

// === Загрузка пользователей ===
let users = [];
try {
  const data = fs.readFileSync(usersFilePath, "utf-8");
  users = JSON.parse(data);
  console.log(`Загружено пользователей: ${users.length}`);
} catch (err) {
  console.log("users.json не найден, создаётся новый");
  users = [];
}

// === Загрузка идей ===
let ideas = [];
let ideaId = 1;
try {
  const data = fs.readFileSync(ideasFilePath, "utf-8");
  ideas = JSON.parse(data);
  ideaId = ideas.length > 0 ? Math.max(...ideas.map((i) => i.id)) + 1 : 1;
  console.log(`Загружено идей: ${ideas.length}`);
} catch (err) {
  console.log("ideas.json не найден, создаётся новый");
  ideas = [];
}

// Сохранение пользователей
function saveUsers() {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// Сохранение идей
function saveIdeas() {
  fs.writeFileSync(ideasFilePath, JSON.stringify(ideas, null, 2));
}

// === Роуты ===

// Регистрация
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const newUser = { username, email, password };
  users.push(newUser);
  saveUsers();

  res.json({ message: "Registered" });
});

// Вход
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid login or password" });
  }

  res.json({ message: "Logged in", username: user.username });
});

// Получить все идеи
app.get("/ideas", (_req, res) => {
  res.json(ideas);
});
/* Получить названия идей 
app.get("/ideas", (_req, res) => {
  res.json(ideas.title);
});*/

// Добавить идею
app.post("/ideas", (req, res) => {
  const { title, description, author } = req.body;

  const newIdea = {
    id: ideaId++,
    title,
    description,
    author,
    comments: [],
  };

  ideas.push(newIdea);
  saveIdeas();

  res.json(newIdea);
});

// Добавить комментарий
app.post("/ideas/:id/comments", (req, res) => {
  const { id } = req.params;
  const { author, text } = req.body;

  const idea = ideas.find((i) => i.id === parseInt(id));
  if (!idea) {
    return res.status(404).json({ message: "Idea not found" });
  }

  idea.comments.push({ author, text });
  saveIdeas();

  res.json(idea);
});

// === Запуск сервера ===
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
