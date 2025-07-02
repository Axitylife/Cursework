import React, { useState } from "react";
import s from "../../styles/IdeadCommon.module.css";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export const CreateIdeaModal: React.FC<Props> = ({ onClose, onCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    if (!title.trim()) return;

    const author = localStorage.getItem("username") || "Anonymous";

    try {
      await fetch("http://localhost:4000/ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, author }),
      });

      onCreated();
      onClose();
    } catch (err) {
      alert("Ошибка при создании идеи");
    }
  };

  return (
    <div className={s.modal}>
      <h3>Создать новую идею</h3>
      <input
        className={s.input}
        type="text"
        placeholder="Название"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <textarea
        className={s.input}
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={5}
        style={{ width: "100%" }}
      />
      <br />
      <button className={s.button} onClick={handleCreate}>
        Сохранить
      </button>
      <button className={s.button} onClick={onClose}>
        Отмена
      </button>
    </div>
  );
};
