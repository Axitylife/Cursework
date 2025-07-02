import React from "react";
import { Comments } from "../Comment";
import s from "./IdeaModal.module.css";

interface Idea {
  id: number;
  title: string;
  description: string;
  author?: string;
  createdAt?: string;
}

interface Props {
  idea: Idea;
  onClose: () => void;
}

export const IdeaModal: React.FC<Props> = ({ idea, onClose }) => {
  const currentUser = localStorage.getItem("username");

  const handleDelete = async () => {
    if (!window.confirm("Вы уверены, что хотите удалить эту идею?")) return;

    const res = await fetch(`http://localhost:4000/ideas/${idea.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: currentUser }),
    });

    if (res.ok) {
      alert("Идея удалена и перемещена в архив");
      onClose();
      window.location.reload(); // или вызвать onUpdated, если будет
    } else {
      const data = await res.json();
      alert(`Ошибка: ${data.message}`);
    }
  };

  return (
    <div className={s.modal}>
      <div className={s.wrapperBTN}>
        {" "}
        {/* Показываем "Удалить", если автор совпадает */}
        {idea.author === currentUser && (
          <button className={s.deleteBTN} onClick={handleDelete}>
            Удалить
          </button>
        )}
        <img
          onClick={onClose}
          src="/public/icons/cross.png"
          className={s.closeBTN}
        />
      </div>
      <div className={s.wrapper}>
        <div>
          <h3>Название: {idea.title}</h3>
          <hr></hr>

          <p>Описание: {idea.description}</p>
          <hr></hr>
        </div>
        {(idea.author || idea.createdAt) && (
          <small>
            {idea.author && (
              <>
                Автор: <strong>{idea.author}</strong> <br />
              </>
            )}
            <hr></hr>
            {idea.createdAt && (
              <>Создано: {new Date(idea.createdAt).toLocaleString()}</>
            )}
            <hr></hr>
          </small>
        )}
      </div>

      <Comments ideaId={idea.id} />
    </div>
  );
};
