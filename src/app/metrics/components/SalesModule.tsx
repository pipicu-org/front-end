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
import { getOrdersByDay, getLinesByDay } from "../../services/metrics.service";
import { OrdersByDay, LinesByDay, DateRange } from "../../types/metrics.type";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

const SalesModule = ({ dateRange, refreshKey }: { dateRange: DateRange; refreshKey: number }) => {
  const [ordersData, setOrdersData] = useState<OrdersByDay[]>([]);
  const [linesData, setLinesData] = useState<LinesByDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJson, setShowJson] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {

        const [orders, lines] = await Promise.all([
          getOrdersByDay(dateRange),
          getLinesByDay(dateRange)
        ]);

        setOrdersData(orders);
        setLinesData(lines);
      } catch (error) {
        console.error("Error loading sales data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dateRange, refreshKey]);

  const ordersChartData = {
    labels: ordersData.map(item => item.day),
    datasets: [{
      label: 'Cantidad de órdenes',
      data: ordersData.map(item => item.total_orders),
      borderColor: 'rgb(54, 162, 235)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      tension: 0.1
    }]
  };

  const linesChartData = {
    labels: linesData.map(item => item.day),
    datasets: [{
      label: 'Cantidad de líneas',
      data: linesData.map(item => item.total_orders),
      borderColor: 'rgb(255, 159, 64)',
      backgroundColor: 'rgba(255, 159, 64, 0.2)',
      tension: 0.1
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cantidad'
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
      <div className="flex justify-end gap-2">
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

      {showJson && (
        <Card className="mb-6">
          <CardHeader>
            <h4 className="text-md font-semibold">Datos JSON</h4>
          </CardHeader>
          <CardBody>
            <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-60">
              {JSON.stringify({ ordersData, linesData }, null, 2)}
            </pre>
          </CardBody>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Cantidad de órdenes por día</h3>
            <Tooltip content="Gráfico que muestra la evolución diaria del número de órdenes">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 cursor-help">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </Tooltip>
          </CardHeader>
          <CardBody>
            <Line data={ordersChartData} options={chartOptions} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Cantidad de líneas por día</h3>
            <Tooltip content="Gráfico que muestra la evolución diaria del número de líneas de pedido">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 cursor-help">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </Tooltip>
          </CardHeader>
          <CardBody>
            <Line data={linesChartData} options={chartOptions} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default SalesModule;