import { Routes, Route } from "react-router-dom";
import Ideas from "./pages/Ideas";
//import { Idea } from "./pages/Idea";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
//<Route path="/idea/:id" element={<Idea />} />
function App() {
  return (
    <Routes>
      <Route path="/" element={<Ideas />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
