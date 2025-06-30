import React, { useState } from "react";
import s from "./CR.module.css";
interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export const CreateIdeaModal: React.FC<Props> = ({ onClose, onCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    if (!title.trim()) return;

    try {
      await fetch("http://localhost:4000/ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
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
        type="text"
        placeholder="Название"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={5}
        style={{ width: "100%" }}
      />
      <br />
      <button onClick={handleCreate}>Сохранить</button>
      <button onClick={onClose}>Отмена</button>
    </div>
  );
};
