import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoutes from './components/PrivateRoutes'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import { maestroLogin } from './services/authservice'
import Admin from './pages/Admin';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Leer el estado inicial desde localStorage
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  /*Esta funcion administra las cookies, las cuales se usan para hacer las queries necesarias en el dashboard
   * y maneja las rutas privadas para darle o quitarle el acceso al usuario*/
  const onLogin = async (correo: string, grupo: string) => {
    const result = await maestroLogin(correo, grupo);
    if (result.Valido) {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('IDMaestro', result.IDMaestro);
      localStorage.setItem('Grupo', grupo);
      return true;
    } else {
      setIsAuthenticated(false);
      localStorage.setItem('isAuthenticated', 'false');
      return false;
    }
  };

  /*Cuando el usuario hace logout, se borra toda su informacion*/
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('Grupo');
    localStorage.removeItem('IDMaestro');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route element={<PrivateRoutes isAuthenticated={isAuthenticated} />}>
          <Route path="/dashboard" element={<Dashboard onLogout={logout} />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route path="/login" element={<Login onLogin={onLogin} />} />
      </Routes>
    </Router>
  );
}

export default App;
