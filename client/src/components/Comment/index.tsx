import React, { useEffect, useState } from "react";
import common from "../../styles/IdeadCommon.module.css";
import s from "./Comments.module.css";

interface Comment {
  id: number;
  author: string;
  text: string;
  createdAt: string;
}

interface Props {
  ideaId: number;
}

export const Comments: React.FC<Props> = ({ ideaId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const fetchComments = () => {
    fetch(`http://localhost:4000/ideas/${ideaId}/comments`)
      .then((res) => res.json())
      .then(setComments)
      .catch((err) => {
        console.error("Ошибка при загрузке комментариев:", err);
      });
  };

  useEffect(() => {
    fetchComments();
  }, [ideaId]);

  const handleAdd = async () => {
    if (!newComment.trim()) return;

    const author = localStorage.getItem("username") || "Anonymous";

    const res = await fetch(`http://localhost:4000/ideas/${ideaId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        author,
        content: newComment,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(`Ошибка: ${data.message || "не удалось добавить комментарий"}`);
      return;
    }

    setNewComment("");
    fetchComments();
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`http://localhost:4000/comments/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      alert("Не удалось удалить комментарий");
      return;
    }
    fetchComments();
  };

  const handleUpdate = async (id: number) => {
    if (!editingText.trim()) return;

    const res = await fetch(`http://localhost:4000/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editingText }),
    });

    if (!res.ok) {
      alert("Не удалось обновить комментарий");
      return;
    }

    setEditingId(null);
    fetchComments();
  };

  return (
    <div className={s.wrapper}>
      <h4>Комментарии</h4>

      {comments.map((comment) => (
        <div key={comment.id}>
          {editingId === comment.id ? (
            <div className={s.wrapperInput}>
              <textarea
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                rows={3}
                className={s.input}
              />
              <div className={s.buttonBox}>
                <button
                  className={common.button}
                  onClick={() => handleUpdate(comment.id)}
                >
                  Сохранить
                </button>
                <button
                  className={common.button}
                  onClick={() => setEditingId(null)}
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div className={s.wrappComm}>
              <p>
                <strong>{comment.author}</strong>: {comment.text}
              </p>
              <small>{new Date(comment.createdAt).toLocaleString()}</small>
              <hr></hr>
              <div className={s.buttonBox}>
                <button
                  className={common.button}
                  onClick={() => {
                    setEditingId(comment.id);
                    setEditingText(comment.text);
                  }}
                >
                  Редактировать
                </button>
                <button
                  className={s.deleteBTN}
                  onClick={() => handleDelete(comment.id)}
                >
                  Удалить
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      <div className={s.wrapperInput}>
        <textarea
          className={s.input}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Оставьте комментарий"
          rows={3}
        />

        <button className={common.button} onClick={handleAdd}>
          Добавить комментарий
        </button>
      </div>
    </div>
  );
};
