import { useEffect, useState } from "react";
import axios from 'axios';
import ReactApexChart from "react-apexcharts";

interface Porcentaje {
  PromedioAvanceGrupo: number;
};

export default function AvancePromedio() {
  const [avance, setAvance] = useState(0);
  const grupo = localStorage.getItem('Grupo');

  //Se obtiene el porcentaje de avance usando el endpoint del backend
  const fetchAvance = async () => {
    const result = await axios.get<Porcentaje>(`http://127.0.0.1:8000/porcentaje/avance/grupal/${grupo}`);
    const data = result.data;
    setAvance(Number((data.PromedioAvanceGrupo).toFixed(1)));
  }

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      height: 350,
      type: "radialBar"
    },
    title: {
      text: "Porcentaje de avance promedio"
    },
    colors: ['#3a557c'],
    plotOptions: {
      radialBar: {
        hollow: {
          size: '70%',
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: '16px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            color: '#888',
            offsetY: -10
          },
          value: {
            show: true,
            fontSize: '22px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            color: '#111',
            offsetY: 0,
            formatter: function (val) {
              return val + '%';
            }
          }
        }
      }
    },
    labels: ['Progreso']
  };

  //Se grafica el porcentaje obtenido desde el endpoint
  const chartSeries = [avance];

  useEffect(() => {
    fetchAvance();
  }, []);

  return (
    <div>
      <div className="rounded-lg bg-white shadow p-4">
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type="radialBar"
          height={350}
        />
      </div>
    </div>
  )
}
