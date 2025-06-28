import { useState, useEffect } from "react";

export default function Comments({ ideaId, comments: initialComments }) {
  const [text, setText] = useState("");
  const [comments, setComments] = useState(initialComments);
  const username = localStorage.getItem("username");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const addComment = async () => {
    const res = await fetch(`http://localhost:4000/ideas/${ideaId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: username, text }),
    });

    if (res.ok) {
      const updatedIdea = await res.json();
      setComments(updatedIdea.comments);
      setText("");
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
    if (res.ok) {
      const updatedIdea = await res.json();
      setComments(updatedIdea.comments);
    }
  };

  const startEdit = (index, currentText) => {
    setEditIndex(index);
    setEditText(currentText);
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
      const updatedIdea = await res.json();
      setComments(updatedIdea.comments);
      setEditIndex(null);
      setEditText("");
    }
  };

  return (
    <div>
      <h3>Комментарии</h3>
      {comments.map((c, i) => (
        <div key={i}>
          <p>
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
                {c.text}{" "}
                <small style={{ fontSize: "12px", color: "gray" }}>
                  ({new Date(c.date).toLocaleString()})
                </small>
                {c.author === username && (
                  <>
                    {" "}
                    <button onClick={() => startEdit(i, c.text)}>✏️</button>
                    <button onClick={() => deleteComment(i)}>🗑️</button>
                  </>
                )}
              </>
            )}
          </p>
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
