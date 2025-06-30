import React from "react";
import { Comments } from "../components/Comments";
import s from "./CR.module.css";
interface Idea {
  id: number;
  title: string;
  description: string;
  createdAt?: string;
}

interface Props {
  idea: Idea;
  onClose: () => void;
}

export const IdeaModal: React.FC<Props> = ({ idea, onClose }) => {
  return (
    <div className={s.modals}>
      <h3>{idea.title}</h3>
      <p style={{ whiteSpace: "pre-wrap", marginTop: "10px" }}>
        {idea.description}
      </p>

      {idea.createdAt && (
        <small style={{ display: "block", marginTop: "10px", color: "#666" }}>
          Создано: {new Date(idea.createdAt).toLocaleString()}
        </small>
      )}

      <hr style={{ margin: "15px 0" }} />
      <Comments ideaId={idea.id} />

      <button onClick={onClose} style={{ marginTop: "15px" }}>
        Закрыть
      </button>
    </div>
  );
};
