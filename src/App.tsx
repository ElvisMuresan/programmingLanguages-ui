import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import { ThemeProvider } from "@/components/theme-provider"; // Importă ThemeProvider
import { ModeToggle } from "./components/mode-toggle"; // Importă ModeToggle
import { HomePage } from "./components/HomePage";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <div className="min-h-screen flex flex-col ">
          {/* Adaugă un header în care poți pune comutatorul de temă */}
          <header className="p-4 bg-gray-100 dark:bg-card">
            <div className="container mx-auto flex justify-end">
              {/* Aici este componenta ModeToggle */}
              <ModeToggle />
            </div>
          </header>

          {/* Conținutul principal al aplicației */}
          <main className="flex-1">
            <Routes>
              <Route path="/login" element={<Login />} /> 
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <HomePage />
                  </PrivateRoute>
                }
              /> 
              <Route path="*" element={<Navigate to="/login" />} />
           
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
