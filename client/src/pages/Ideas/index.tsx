import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IdeaModal } from "../../components/IdeaModal";
import { CreateIdeaModal } from "../../components/CreateModal";
import s from "../../styles/IdeadCommon.module.css";

// Интерфейс идеи
interface Idea {
  id: number;
  title: string;
  description: string;
  createdAt?: string;
}

const Ideas = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchIdeas = () => {
    fetch("http://localhost:4000/ideas")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Ошибка при загрузке идей");
        }
        return res.json();
      })
      .then(setIdeas)
      .catch((err) => setError(err.message));
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };

  // === Проверка авторизации ===
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      navigate("/login");
    } else {
      fetchIdeas();
    }
  }, [navigate]);

  return (
    <div className={s.container}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Список идей</h2>
        <button onClick={handleLogout} className={s.button}>
          Выйти
        </button>
      </div>
      <div className={s.wrap}>
        <button
          onClick={() => setShowCreateModal(true)}
          className={s.createBTN}
        >
          + Создать идею
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {ideas.length === 0 && !error && <p>Нет идей</p>}

        {ideas.map((idea) => (
          <div
            key={idea.id}
            onClick={() => setSelectedIdea(idea)}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "8px",
              cursor: "pointer",
              borderRadius: "6px",
            }}
          >
            <strong>{idea.title}</strong>
          </div>
        ))}
      </div>

      {selectedIdea && (
        <IdeaModal idea={selectedIdea} onClose={() => setSelectedIdea(null)} />
      )}

      {showCreateModal && (
        <CreateIdeaModal
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchIdeas}
        />
      )}
    </div>
  );
};
export { Ideas };
