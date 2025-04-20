import { useState, useEffect } from 'react';
import axios from 'axios';

interface Props {
  genero: 'mujer' | 'hombre';
};

interface Alumno {
  NumLista: number;
  Grupo: string;
}

export default function TopGenero({ genero }: Props) {
  const [alumno, setAlumno] = useState<Alumno>({
    NumLista: 0,
    Grupo: '',
  });

  const fetchTop = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/top/global/${genero}`);
      const data = response.data;
      setAlumno(data);
    } catch (err) {
      console.error("No se pudo obtener la informacion del alumno: ", err);
    }
  }

  useEffect(() => {
    fetchTop();
  }, [genero])

  return (
    <div className="p-4 bg-azulInstitucional text-white rounded-xl">
      <h2 className="text-xl font-bold mb-4 text-center">🥇Top global de {genero === 'mujer' ? 'mujeres' : 'hombres'}🥇</h2>
      <div className="space-y-2 text-center">
        <p><strong>Grupo:</strong> {alumno.Grupo}</p>
        <p><strong>Número de Lista:</strong> {alumno.NumLista}</p>
      </div>
    </div>
  )
}
