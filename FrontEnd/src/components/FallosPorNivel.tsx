import ReactApexChart from "react-apexcharts";
import axios from 'axios';
import { useState, useEffect } from 'react';

interface Errores {
  NumNivel: number;
  TotalErrores: number;
};

export default function FallosPorNivel() {
  const nivelesIniciales: Errores[] = [
    { NumNivel: 1, TotalErrores: 0 },
    { NumNivel: 2, TotalErrores: 0 },
    { NumNivel: 3, TotalErrores: 0 },
  ];

  const [errores, setErrores] = useState<Errores[]>(nivelesIniciales);
  const grupo = localStorage.getItem('Grupo');

  const fetchErrores = async () => {
    try {
      const response = await axios.get<Errores>(`http://127.0.0.1:8000/fallos/grupo/${grupo}`);
      const data = response.data;
      if (Array.isArray(data)) {
        const newErrores = nivelesIniciales.map(nivel => {
          const encontrado = data.find(d => d.NumNivel === nivel.NumNivel);
          return encontrado ?? nivel;
        });
        setErrores(newErrores);
      }
      else {
        setErrores(nivelesIniciales);
      }
    } catch (err) {
      console.error("No se pudieron obtener sesiones", err)
      setErrores(nivelesIniciales)
    }
  }

  useEffect(() => {
    fetchErrores();
  }, []);


  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      height: 350,
      type: 'radar',
    },
    title: {
      text: 'Fallos por nivel'
    },
    xaxis: {
      categories: errores.map(e => `Nivel${e.NumNivel}`)
    },
    colors: ['#8fc027']
  };


  const chartSeries = [
    {
      name: 'Fallos',
      data: errores.map(e => e.TotalErrores)
    }
  ];


  return (
    <div>
      <div className="rounded-lg bg-white shadow p-4">
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type="radar"
          height={350}
        />
      </div>
    </div>
  )
}
