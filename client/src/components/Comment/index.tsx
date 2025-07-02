import React, { useEffect, useState } from "react";
import s from "../../styles/IdeadCommon.module.css";

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
      .then(setComments);
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
    await fetch(`http://localhost:4000/comments/${id}`, { method: "DELETE" });
    fetchComments();
  };

  const handleUpdate = async (id: number) => {
    await fetch(`http://localhost:4000/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editingText }),
    });
    setEditingId(null);
    fetchComments();
  };

  return (
    <div>
      <h4>Комментарии</h4>

      {comments.map((comment) => (
        <div
          key={comment.id}
          style={{ borderBottom: "1px solid #ccc", padding: "5px 0" }}
        >
          {editingId === comment.id ? (
            <>
              <textarea
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
              />
              <button
                className={s.button}
                onClick={() => handleUpdate(comment.id)}
              >
                Сохранить
              </button>
              <button className={s.button} onClick={() => setEditingId(null)}>
                Отмена
              </button>
            </>
          ) : (
            <>
              <p style={{ margin: 0 }}>
                <strong>{comment.author}</strong>: {comment.text}
              </p>
              <small>{new Date(comment.createdAt).toLocaleString()}</small>
              <br />
              <button
                className={s.button}
                onClick={() => {
                  setEditingId(comment.id);
                  setEditingText(comment.text);
                }}
              >
                Редактировать
              </button>
              <button
                className={s.button}
                onClick={() => handleDelete(comment.id)}
              >
                Удалить
              </button>
            </>
          )}
        </div>
      ))}

      <textarea
        className={s.input}
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Оставьте комментарий"
        rows={3}
        style={{ width: "100%", marginTop: "10px" }}
      />
      <br />
      <button className={s.button} onClick={handleAdd}>
        Добавить комментарий
      </button>
    </div>
  );
};
