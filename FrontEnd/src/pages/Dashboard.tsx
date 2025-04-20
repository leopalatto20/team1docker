import React from "react";
import { useNavigate } from 'react-router-dom';
import Logo from "./../assets/Escudo.png";
import TopsGlobal from "../components/TopsGrupo";
import TopsGenero from "../components/TopsGenero";
import FallosPorNivel from "../components/FallosPorNivel";
import AvancePromedio from "../components/AvancePromedio";
import TopGlobal from "../components/TopGlobal";
import TopGenero from "../components/TopGenero";

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }: DashboardProps) => {
  const navigate = useNavigate();
  const grupo = localStorage.getItem('Grupo');

  //Se redirige a admin cuando se la hace click al botton
  const handleAdminClick = () => {
    navigate("/admin");
  };

  return (
    <div className="bg-gray-100 font-serif min-h-screen flex flex-col">
      <header className="bg-azulInstitucional text-white p-6">
        <div className="px-4 sm:px-6 flex items-center justify-between">
          <img className="h-16" src={Logo} />

          <div className="flex items-center gap-4 ml-auto">
            <div className="text-lg font-bold">Dashboard</div>
            <button
              type="button"
              className="rounded-lg p-3 bg-verdeInstitucional hover:bg-verdeInstitucionalDark cursor-pointer duration-300 hover:scale-110"
              onClick={handleAdminClick}
            >
              Admin
            </button>
          </div>
        </div>
      </header>
      <div className="flex flex-row w-full p-4 justify-center gap-4 overflow-x-hidden">
        <div className="text-3xl text-center bg-blue-300 p-3 rounded-lg w-3/4">
          Dashboard grupo {grupo}
        </div>
        <button
          type="button"
          className="text-3xl text-white p-3 rounded-lg bg-red-500 hover:bg-red-700 hover:scale-110 duration-300 w-1/4"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
      {/* Esta seccion es el layout de las graficas y mediciones */}
      <div className="grid grid-cols-3 gap-5 px-4">
        <TopsGlobal />
        <TopsGenero genero="mujeres" />
        <TopsGenero genero="hombres" />
      </div>
      <div className="grid grid-cols-3 gap-5 p-4">
        <TopGlobal />
        <TopGenero genero="hombre" />
        <TopGenero genero="mujer" />
      </div>
      <div className="p-4 grid grid-cols-2 gap-5">
        <FallosPorNivel />
        <div className="flex flex-col">
          <AvancePromedio />
        </div>
      </div>
    </div>
  )
};

export default Dashboard;
