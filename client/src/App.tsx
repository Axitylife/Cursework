import { Routes, Route } from "react-router-dom";
import Ideas from "./pages/Ideas";
import Idea from "./pages/idea";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Ideas />} />
      <Route path="/idea/:id" element={<Idea />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
