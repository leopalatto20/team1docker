import { useEffect, useState } from "react";
import axios from 'axios';

interface Props {
  genero: 'mujeres' | 'hombres';
};

interface Alumno {
  NumLista: number;
}

//Se obtiene el top 5 por genero, el cual se obtiene mediante los Props
export default function TopsGenero({ genero }: Props) {
  const grupo = localStorage.getItem("Grupo");
  const fetchTop = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/tops/grupo/${genero}/${grupo}`);
      const data = response.data;
      if (Array.isArray(data))
        setAlumnos(response.data);
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
        Top 5 {genero === 'mujeres' ? 'mujeres' : 'hombres'}
      </div>
      {Alumnos.map((alumno) => (
        <div className="rounded-lg bg-white shadow p-4 text-center">
          Numero de lista: {alumno.NumLista}
        </div>
      ))}
    </div>
  );
}
