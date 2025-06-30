import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import layout from "../../styles/Layout.module.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Пароли не совпадают");
      return;
    }

    const res = await fetch("http://localhost:4000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (res.ok) {
      alert("Вы успешно зарегистрированы");
      localStorage.setItem("username", username);
      navigate("/");
    } else {
      const data = await res.json();
      alert(data.message);
    }
  };

  return (
    <div className={layout.container}>
      <h2>Регистрация</h2>
      <div className={layout.wrapper}>
        <input
          className={layout.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

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

        <input
          className={layout.input}
          type="password"
          placeholder="Подтвердите пароль"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button className={layout.button} onClick={handleRegister}>
          Зарегистрироваться
        </button>
      </div>
      <p>
        Уже есть аккаунт?{" "}
        <Link className={layout.link} to="/login">
          Войдите
        </Link>
      </p>
    </div>
  );
};
export { Register };
