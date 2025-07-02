const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4000;

// === Пути к файлам ===
const usersFilePath = path.join(__dirname, "users.json");
const ideasFilePath = path.join(__dirname, "ideas.json");
const archiveFilePath = path.join(__dirname, "archive.json");

// === Загрузка данных ===
let users = [];
let ideas = [];
let archivedIdeas = [];

let ideaId = 1;
let commentId = 1;

try {
  users = JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));
  console.log(`Загружено пользователей: ${users.length}`);
} catch {
  users = [];
}

try {
  ideas = JSON.parse(fs.readFileSync(ideasFilePath, "utf-8"));
  ideaId = ideas.length > 0 ? Math.max(...ideas.map((i) => i.id)) + 1 : 1;

  const allComments = ideas.flatMap((i) => i.comments || []);
  commentId =
    allComments.length > 0
      ? Math.max(...allComments.map((c) => c.id || 0)) + 1
      : 1;

  console.log(`Загружено идей: ${ideas.length}`);
} catch {
  ideas = [];
}

try {
  archivedIdeas = JSON.parse(fs.readFileSync(archiveFilePath, "utf-8"));
} catch {
  archivedIdeas = [];
}

// === Функции сохранения ===
function saveUsers() {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}
function saveIdeas() {
  fs.writeFileSync(ideasFilePath, JSON.stringify(ideas, null, 2));
}
function saveArchive() {
  fs.writeFileSync(archiveFilePath, JSON.stringify(archivedIdeas, null, 2));
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

// Получить одну идею
app.get("/ideas/:id", (req, res) => {
  const idea = ideas.find((i) => i.id === parseInt(req.params.id));
  if (!idea) return res.status(404).json({ message: "Idea not found" });
  res.json(idea);
});

// Добавить идею
app.post("/ideas", (req, res) => {
  const { title, description, author } = req.body;

  if (!title || !description || !author) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const newIdea = {
    id: ideaId++,
    title,
    description,
    author,
    createdAt: new Date().toISOString(),
    comments: [],
  };

  ideas.push(newIdea);
  saveIdeas();

  res.json(newIdea);
});

// === КОММЕНТАРИИ ===

// Получить комментарии для идеи
app.get("/ideas/:id/comments", (req, res) => {
  const idea = ideas.find((i) => i.id === parseInt(req.params.id));
  if (!idea) return res.status(404).json({ message: "Idea not found" });

  res.json(idea.comments || []);
});

// Добавить комментарий
app.post("/ideas/:id/comments", (req, res) => {
  const idea = ideas.find((i) => i.id === parseInt(req.params.id));
  if (!idea) return res.status(404).json({ message: "Idea not found" });

  const { author, content } = req.body;
  if (!author || !content) {
    return res.status(400).json({ message: "Author and content required" });
  }

  const comment = {
    id: commentId++,
    author,
    text: content,
    createdAt: new Date().toISOString(),
  };

  idea.comments = idea.comments || [];
  idea.comments.push(comment);
  saveIdeas();

  res.json(comment);
});

// Удалить комментарий
app.delete("/comments/:commentId", (req, res) => {
  const id = parseInt(req.params.commentId);

  for (const idea of ideas) {
    const index = idea.comments?.findIndex((c) => c.id === id);
    if (index !== -1 && index !== undefined) {
      idea.comments.splice(index, 1);
      saveIdeas();
      return res.json({ message: "Comment deleted" });
    }
  }

  res.status(404).json({ message: "Comment not found" });
});

// Редактировать комментарий
app.patch("/comments/:commentId", (req, res) => {
  const id = parseInt(req.params.commentId);
  const { content } = req.body;

  for (const idea of ideas) {
    const comment = idea.comments?.find((c) => c.id === id);
    if (comment) {
      comment.text = content;
      saveIdeas();
      return res.json(comment);
    }
  }

  res.status(404).json({ message: "Comment not found" });
});

// Удалить идею (в архив)
app.delete("/ideas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { username } = req.body;

  const index = ideas.findIndex((i) => i.id === id);
  if (index === -1) return res.status(404).json({ message: "Idea not found" });

  const idea = ideas[index];

  if (idea.author !== username) {
    return res
      .status(403)
      .json({ message: "Only the author can delete this idea" });
  }

  ideas.splice(index, 1);
  archivedIdeas.push(idea);
  saveIdeas();
  saveArchive();

  res.json({ message: "Idea archived" });
});

// === Запуск ===
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
