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
  ArcElement,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import {
  getGMVByDay,
  getGPByDay,
  getGMVByPaymentMethod,
  getGMVByContactMethod
} from "../../services/metrics.service";
import { GMVByDay, GPByDay, GMVByPaymentMethod, GMVByContactMethod, DateRange } from "../../types/metrics.type";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
);

const RevenueModule = ({ dateRange, refreshKey }: { dateRange: DateRange; refreshKey: number }) => {
  const [gmvData, setGmvData] = useState<GMVByDay[]>([]);
  const [gpData, setGpData] = useState<GPByDay[]>([]);
  const [paymentMethodData, setPaymentMethodData] = useState<GMVByPaymentMethod[]>([]);
  const [contactMethodData, setContactMethodData] = useState<GMVByContactMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJson, setShowJson] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {

        const [gmv, gp, paymentMethods, contactMethods] = await Promise.all([
          getGMVByDay(dateRange),
          getGPByDay(),
          getGMVByPaymentMethod(),
          getGMVByContactMethod()
        ]);

        setGmvData(gmv);
        setGpData(gp);
        setPaymentMethodData(paymentMethods);
        setContactMethodData(contactMethods);
      } catch (error) {
        console.error("Error loading revenue data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dateRange, refreshKey]);

  const gmvChartData = {
    labels: gmvData.map(item => item.day),
    datasets: [{
      label: 'Ganancia Bruta',
      data: gmvData.map(item => item.gmv),
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1
    }]
  };

  const gpChartData = {
    labels: gpData.map(item => item.day),
    datasets: [{
      label: 'Beneficio Bruto',
      data: gpData.map(item => item.gp),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      tension: 0.1
    }]
  };

  const paymentMethodChartData = {
    labels: paymentMethodData.map(item => item.paymentMethod),
    datasets: [{
      data: paymentMethodData.map(item => item.gmv),
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 205, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
      ],
      borderWidth: 1,
    }]
  };

  const contactMethodChartData = {
    labels: contactMethodData.map(item => item.contactMethod),
    datasets: [{
      data: contactMethodData.map(item => parseFloat(item.gmv)),
      backgroundColor: [
        'rgba(255, 159, 64, 0.8)',
        'rgba(199, 199, 199, 0.8)',
        'rgba(83, 102, 255, 0.8)',
        'rgba(255, 99, 132, 0.8)',
      ],
      borderWidth: 1,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
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
              {JSON.stringify({ gmvData, gpData, paymentMethodData, contactMethodData }, null, 2)}
            </pre>
          </CardBody>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Ganancia Bruta por día</h3>
            <Tooltip content="Muestra la evolución diaria de las ganancias brutas totales">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 cursor-help">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </Tooltip>
          </CardHeader>
          <CardBody>
            <Line data={gmvChartData} options={chartOptions} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Beneficio Bruto por día</h3>
            <Tooltip content="Muestra la evolución diaria de los beneficios brutos">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 cursor-help">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </Tooltip>
          </CardHeader>
          <CardBody>
            <Line data={gpChartData} options={chartOptions} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Ganancia Bruta por método de pago</h3>
            <Tooltip content="Distribución de ganancias por diferentes métodos de pago">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 cursor-help">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </Tooltip>
          </CardHeader>
          <CardBody>
            <Pie data={paymentMethodChartData} options={chartOptions} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Ganancia Bruta por método de contacto</h3>
            <Tooltip content="Distribución de ganancias por diferentes métodos de contacto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 cursor-help">
                <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </Tooltip>
          </CardHeader>
          <CardBody>
            <Pie data={contactMethodChartData} options={chartOptions} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default RevenueModule;