import { useState, useEffect } from 'react';
import axios from 'axios';

interface Alumno {
  NumLista: number;
  Genero: string;
  Grupo: string;
};

export default function TopGlobal() {
  const fetchTop = async () => {
    try {
      const response = await axios.get<Alumno>("http://127.0.0.1:8000/top/global");
      const data = response.data;
      setAlumno(data);
    } catch (err) {
      console.error("No se pudo obtener al alumno: ", err);
    }
  }
  const [alumno, setAlumno] = useState<Alumno>({
    Grupo: '',
    Genero: '',
    NumLista: 0,
  });

  useEffect(() => {
    fetchTop();
  }, [])

  return (
    <div className="p-4 bg-azulInstitucional text-white rounded-xl">
      <h2 className="text-xl font-bold mb-4 text-center">🥇Top Global🥇</h2>
      <div className="space-y-2 text-center">
        <p><strong>Grupo:</strong> {alumno.Grupo}</p>
        <p><strong>Género:</strong> {alumno.Genero}</p>
        <p><strong>Número de Lista:</strong> {alumno.NumLista}</p>
      </div>
    </div>
  );
}
