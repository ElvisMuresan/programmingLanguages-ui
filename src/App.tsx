import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./components/Login"; // Importă componenta Login

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Definim ruta pentru Login */}
        {/* Poți adăuga și alte rute aici */}
      </Routes>
    </Router>
  );
}

export default App;
