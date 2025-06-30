import React, { useEffect, useState } from "react";

interface Comment {
  id: number;
  ideaId: number;
  content: string;
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
    await fetch(`http://localhost:4000/ideas/${ideaId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newComment }),
    });
    setNewComment("");
    fetchComments();
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:4000/comments/${id}`, { method: "DELETE" });
    fetchComments();
  };

  const handleUpdate = async (id: number) => {
    await fetch(`http://localhost:4000/comments/${id}`, {
      method: "PUT",
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
              <button onClick={() => handleUpdate(comment.id)}>
                Сохранить
              </button>
              <button onClick={() => setEditingId(null)}>Отмена</button>
            </>
          ) : (
            <>
              <p style={{ margin: 0 }}>{comment.content}</p>
              <small>{new Date(comment.createdAt).toLocaleString()}</small>
              <br />
              <button
                onClick={() => {
                  setEditingId(comment.id);
                  setEditingText(comment.content);
                }}
              >
                Редактировать
              </button>
              <button onClick={() => handleDelete(comment.id)}>Удалить</button>
            </>
          )}
        </div>
      ))}

      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Оставьте комментарий"
        rows={3}
        style={{ width: "100%", marginTop: "10px" }}
      />
      <br />
      <button onClick={handleAdd}>Добавить комментарий</button>
    </div>
  );
};
