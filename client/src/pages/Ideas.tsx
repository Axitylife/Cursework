import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Ideas() {
  const [ideas, setIdeas] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const username = localStorage.getItem("username");

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = () => {
    fetch("http://localhost:4000/ideas")
      .then((res) => res.json())
      .then((data) => setIdeas(data));
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };

  const handleCreateIdea = async () => {
    if (!title || !description) {
      alert("Заполните все поля");
      return;
    }

    const res = await fetch("http://localhost:4000/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, author: username }),
    });

    if (res.ok) {
      setTitle("");
      setDescription("");
      fetchIdeas();
    } else {
      alert("Ошибка при добавлении идеи");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Идеи</h2>
        <button onClick={handleLogout}>Выйти</button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Название"
          style={{ width: "100%", marginBottom: "8px" }}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Описание"
          style={{ width: "100%", marginBottom: "8px" }}
        />
        <button onClick={handleCreateIdea}>Добавить идею</button>
      </div>

      {ideas.map((idea) => (
        <div
          key={idea.id}
          onClick={() => navigate(`/idea/${idea.id}`)}
          style={{
            cursor: "pointer",
            padding: "10px",
            border: "1px solid #ccc",
            marginBottom: "10px",
            borderRadius: "6px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <strong>{idea.title}</strong>
        </div>
      ))}
    </div>
  );
}
