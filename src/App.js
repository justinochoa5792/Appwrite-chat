import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoutes from "./components/PrivateRoutes";
import Room from "./pages/Room";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./utils/AuthContext";
import Register from "./pages/Register";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<PrivateRoutes />}>
              <Route path="/" element={<Room />} />
            </Route>
            <Route path="/register" element={<Register />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
