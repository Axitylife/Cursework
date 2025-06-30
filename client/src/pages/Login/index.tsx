import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import layout from "../../styles/Layout.module.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("username", data.username);
      alert("Успешный вход");
      navigate("/");
    } else {
      const data = await res.json();
      alert(data.message);
    }
  };

  return (
    <div className={layout.container}>
      <h2>Вход</h2>
      <div className={layout.wrapper}>
        <input
          className={layout.input}
          placeholder="Логин"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className={layout.input}
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={layout.button} onClick={handleLogin}>
          Войти
        </button>
      </div>
      <p className={layout.note}>
        Еще нет аккаунта?{" "}
        <Link className={layout.link} to="/register">
          Зарегистрируйтесь
        </Link>
      </p>
    </div>
  );
};
export { Login };
