import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  onLogin: (correo: string, grupo: string) => Promise<boolean>;
}

const Login: React.FC<Props> = ({ onLogin }) => {
  const [correo, setCorreo] = useState('');
  const [grupo, setGrupo] = useState('');
  const [darkMode, setDarkMode] = useState(false); // Estado para el modo oscuro
  const navigate = useNavigate();

  /*Cuando se hace el submit del boton, se llama a la funcion onLogin 
   * Para evaluar el resultado del submit, si es correcta se manda al usuario a dashboard
   * y si no se muestra una alerta*/
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onLogin(correo, grupo);
    if (success) {
      navigate('/dashboard');
    } else {
      alert('Credenciales incorrectas. Inténtalo de nuevo.');
    }
  };

  // Cambia el tema al cargar la página
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      setDarkMode(true);
    }
  }, []);

  // Guarda el modo en el almacenamiento local
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${darkMode ? 'bg-blue-950' : 'bg-gray-100'
        }`}
    >
      <form
        className={`p-8 rounded-lg shadow-lg w-full max-w-sm ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
          }`}
        onSubmit={handleSubmit}
      >
        {/* Imagen del escudo */}
        <div className="flex justify-center mb-4">
        </div>

        <h2
          className={`text-2xl font-bold mb-6 text-center ${darkMode ? 'text-yellow-400' : 'text-[#3A557C]'
            }`}
        >
          Operacion Escape
        </h2>

        <div className="mb-4">
          <label
            className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-[#3A557C]'}`}
          >
            Correo electrónico
          </label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'
              }`}
            required
          />
        </div>

        <div className="mb-6">
          <label
            className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-[#3A557C]'}`}
          >
            Grupo
          </label>
          <input
            type="text"
            value={grupo}
            onChange={(e) => setGrupo(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'
              }`}
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 rounded-md font-semibold transition-colors duration-200 ${darkMode ? 'bg-blue-900 text-white' : 'bg-yellow-400 text-[#3A557C]'
            }`}
        >
          Iniciar sesión
        </button>

        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className="w-full py-2 mt-4 rounded-md text-sm font-semibold transition-colors duration-200"
          style={{
            backgroundColor: darkMode ? '#F9C74F' : '#3A557C',
            color: darkMode ? '#3A557C' : 'white',
          }}
        >
          Cambiar a {darkMode ? 'modo claro' : 'modo oscuro'}
        </button>
      </form>
    </div>
  );
};

export default Login;
