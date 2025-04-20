import { useEffect, useState } from "react";
import axios from 'axios';

interface Alumno {
  NumLista: number;
  Genero: string;
};

//Se obtiene los 5 mejores alumnos sin importar su genero
export default function TopsGlobal() {
  const grupo = localStorage.getItem("Grupo");
  const fetchTop = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/tops/grupo/${grupo}`);
      const data = response.data;
      if (Array.isArray(data))
        setAlumnos(data);
      else
        setAlumnos([]);
    } catch (err) {
      console.error("Error al obtener la informacion de los alumnos", err);
    }
  }

  useEffect(() => {
    fetchTop();
  }, [grupo])

  const [Alumnos, setAlumnos] = useState<Alumno[]>([]);
  return (
    <div className="rounded-lg flex flex-col gap-4">
      <div className="rounded-lg bg-grisInstitucional shadow text-center text-lg p-3">
        Top 5 grupo
      </div>
      {Alumnos.map((alumno) => (
        <div className="rounded-lg bg-white shadow p-4 text-center">
          Genero: {alumno.Genero} Numero de lista: {alumno.NumLista}
        </div>
      ))}
    </div>
  );
}
