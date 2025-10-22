"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Button, Tooltip } from "@heroui/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getCostByIngredient } from "../../services/metrics.service";
import { CostByIngredient, DateRange } from "../../types/metrics.type";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

const CostsModule = ({ dateRange, refreshKey }: { dateRange: DateRange; refreshKey: number }) => {
  const [costData, setCostData] = useState<CostByIngredient[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showJson, setShowJson] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {

        const ingredientFilter = selectedIngredient ? { ingredientId: parseInt(selectedIngredient) } : undefined;
        const data = await getCostByIngredient(ingredientFilter);
        setCostData(data);
      } catch (error) {
        console.error("Error loading cost data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dateRange, selectedIngredient, refreshKey]);

  // Obtener ingredientes únicos para el filtro
  const uniqueIngredients = Array.from(
    new Set(costData.map(item => `${item.ingredientId}-${item.ingredientName}`))
  ).map(ingredientStr => {
    const [id, name] = ingredientStr.split('-');
    return { id: parseInt(id), name };
  });

  // Preparar datos para el gráfico
  const chartData = {
    labels: Array.from(new Set(costData.map(item => item.day))).sort(),
    datasets: uniqueIngredients.map((ingredient, index) => {
      const ingredientData = costData.filter(item => item.ingredientId === ingredient.id);
      const colors = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 205, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ];

      return {
        label: ingredient.name,
        data: Array.from(new Set(costData.map(item => item.day))).sort().map(day => {
          const dayData = ingredientData.find(item => item.day === day);
          return dayData ? dayData.cost : 0;
        }),
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length].replace('1)', '0.2)'),
        tension: 0.1
      };
    })
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Costos por ingrediente por día'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Costo ($)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Fecha'
        }
      }
    }
  };

  if (loading) {
    return <div className="text-center p-8">Cargando datos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Costos</h2>
          <Tooltip content="Módulo para visualizar los costos de ingredientes por día">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 cursor-help">
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
          </Tooltip>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedIngredient}
            onChange={(e) => setSelectedIngredient(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md w-64"
          >
            <option value="">Todos los ingredientes</option>
            {uniqueIngredients.map((ingredient) => (
              <option key={ingredient.id.toString()} value={ingredient.id.toString()}>
                {ingredient.name}
              </option>
            ))}
          </select>
          <Tooltip content="Ver datos JSON">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onPress={() => setShowJson(!showJson)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
              </svg>
            </Button>
          </Tooltip>
        </div>
      </div>

      {showJson && (
        <Card className="mb-6">
          <CardHeader>
            <h4 className="text-md font-semibold">Datos JSON</h4>
          </CardHeader>
          <CardBody>
            <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-60">
              {JSON.stringify({ costData }, null, 2)}
            </pre>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Costos por ingrediente por día</h3>
          <Tooltip content="Gráfico de líneas que muestra la evolución de costos de diferentes ingredientes">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 cursor-help">
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
          </Tooltip>
        </CardHeader>
        <CardBody>
          <Line data={chartData} options={chartOptions} />
        </CardBody>
      </Card>
    </div>
  );
};

export default CostsModule;