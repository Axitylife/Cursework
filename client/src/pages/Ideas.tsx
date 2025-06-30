import React, { useState, useEffect } from "react";
import { IdeaModal } from "./IdeaModal";
import { CreateIdeaModal } from "./CreateIdeaModal";

// Интерфейс идеи
interface Idea {
  id: number;
  title: string;
  description: string;
  createdAt?: string;
}

export default function Ideas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchIdeas();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Список идей</h2>

      <button
        onClick={() => setShowCreateModal(true)}
        style={{ marginBottom: "10px" }}
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
}
