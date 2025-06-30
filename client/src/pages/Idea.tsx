import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Comments from "../components/Comments";

const Idea = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [idea, setIdea] = useState(null);
  const username = localStorage.getItem("username");

  useEffect(() => {
    fetch("http://localhost:4000/ideas")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((i) => i.id === parseInt(id));
        setIdea(found);
      });
  }, [id]);

  const deleteIdea = async () => {
    const confirmed = window.confirm(
      "Вы уверены, что хотите удалить эту идею?"
    );
    if (!confirmed) return;

    const res = await fetch(`http://localhost:4000/ideas/${idea.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    if (res.ok) {
      alert("Идея удалена и перемещена в архив.");
      navigate("/");
    } else {
      const err = await res.json();
      alert(err.message);
    }
  };

  if (!idea) return <div>Загрузка...</div>;

  return (
    <div>
      <button onClick={() => navigate("/")}>← Назад к списку</button>
      <h2>{idea.title}</h2>
      <p>{idea.description}</p>
      <p>
        <i>Автор: {idea.author}</i>
      </p>

      {idea.author === username && (
        <button onClick={deleteIdea} style={{ color: "red" }}>
          Удалить идею
        </button>
      )}

      <Comments ideaId={idea.id} comments={idea.comments} />
    </div>
  );
};
export { Idea };
