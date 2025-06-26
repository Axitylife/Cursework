import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Idea {
  id: number;
  title: string;
  description: string;
  author: string;
  comments: { author: string; text: string }[];
}

export default function Ideas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const fetchIdeas = async () => {
    const res = await fetch("http://localhost:4000/ideas");
    const data = await res.json();
    setIdeas(data);
  };

  const postIdea = async () => {
    const res = await fetch("http://localhost:4000/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        author: localStorage.getItem("username"),
      }),
    });

    if (res.ok) {
      setTitle("");
      setDescription("");
      fetchIdeas();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };

  const showLogses = () => {
    console.log("Hello");
  };
  const comment = async (id: number, text: string) => {
    await fetch(`http://localhost:4000/ideas/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        author: localStorage.getItem("username"),
        text,
      }),
    });
    fetchIdeas();
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  return (
    <div>
      {ideas.map((idea) => (
        <button onClick={showLogses}>{idea.title}</button>
      ))}
      <div>
        <button onClick={handleLogout}>Выйти</button>
      </div>
      <h2>Ideas</h2>
      <div>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <button onClick={postIdea}>Post Idea</button>
      </div>
      <hr />
      {ideas.map((idea) => (
        <div key={idea.id} style={{ border: "1px solid gray", margin: "10px" }}>
          <h3>{idea.title}</h3>
          <p>{idea.description}</p>
          <p>
            <i>by {idea.author}</i>
          </p>

          <h4>Comments:</h4>
          {idea.comments.map((c, i) => (
            <p key={i}>
              <b>{c.author}:</b> {c.text}
            </p>
          ))}

          <CommentForm ideaId={idea.id} onComment={comment} />
        </div>
      ))}
    </div>
  );
}

function CommentForm({
  ideaId,
  onComment,
}: {
  ideaId: number;
  onComment: (id: number, text: string) => void;
}) {
  const [text, setText] = useState("");
  return (
    <div>
      <input
        placeholder="Add comment"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          onComment(ideaId, text);
          setText("");
        }}
      >
        Send
      </button>
    </div>
  );
}
