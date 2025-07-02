import React, { useState } from "react";
import s from "./CreateIdeaModal.module.css";

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
    <div className={s.container}>
      <div className={s.headerBox}>
        <h3 className={s.header}>Создать новую идею</h3>
        <img
          src="/public/icons/cross.png"
          className={s.closeButton}
          onClick={onClose}
        />
      </div>
      <div className={s.wrapper}>
        <div className={s.title}>Название</div>
        <input
          className={s.inputW}
          type="text"
          placeholder="Введите название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>{" "}
      <div className={s.title}>Описание</div>
      <textarea
        className={s.inputW}
        placeholder="Введите описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={5}
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
