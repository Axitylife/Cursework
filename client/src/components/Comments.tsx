import { useState } from "react";

export default function Comments({ ideaId, initialComments, author, onClose }) {
  const [comments, setComments] = useState(initialComments || []);
  const [text, setText] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const username = localStorage.getItem("username");

  const fetchComments = async () => {
    const res = await fetch(`http://localhost:4000/ideas`);
    const data = await res.json();
    const idea = data.find((i) => i.id === ideaId);
    if (idea) setComments(idea.comments);
  };

  const addComment = async () => {
    const res = await fetch(`http://localhost:4000/ideas/${ideaId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: username, text }),
    });

    if (res.ok) {
      setText("");
      fetchComments();
    }
  };

  const deleteComment = async (index) => {
    const res = await fetch(
      `http://localhost:4000/ideas/${ideaId}/comments/${index}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (res.ok) fetchComments();
  };

  const saveEdit = async (index) => {
    const res = await fetch(
      `http://localhost:4000/ideas/${ideaId}/comments/${index}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editText }),
      }
    );
    if (res.ok) {
      setEditIndex(null);
      setEditText("");
      fetchComments();
    }
  };

  return (
    <div>
      <h4>Комментарии</h4>
      {comments.map((c, i) => (
        <div key={i}>
          <b>{c.author}</b>:{" "}
          {editIndex === i ? (
            <>
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <button onClick={() => saveEdit(i)}>💾</button>
              <button onClick={() => setEditIndex(null)}>✖</button>
            </>
          ) : (
            <>
              {c.text} <small>({new Date(c.date).toLocaleString()})</small>
              {c.author === username && (
                <>
                  <button
                    onClick={() => {
                      setEditIndex(i);
                      setEditText(c.text);
                    }}
                  >
                    ✏️
                  </button>
                  <button onClick={() => deleteComment(i)}>🗑️</button>
                </>
              )}
            </>
          )}
        </div>
      ))}

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Новый комментарий"
      />
      <button onClick={addComment}>Отправить</button>
    </div>
  );
}
