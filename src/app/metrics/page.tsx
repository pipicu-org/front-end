"use client";

import { Tabs, Tab, Button, Tooltip } from "@heroui/react";
import { useState } from "react";
import { DateRange } from "../types/metrics.type";
import RevenueModule from "./components/RevenueModule";
import CostsModule from "./components/CostsModule";
import StockModule from "./components/StockModule";
import SalesModule from "./components/SalesModule";

const Metrics = () => {
  const [activeTab, setActiveTab] = useState("revenue");
  const getDefaultDateRange = () => {
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    return {
      startDate: oneWeekAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    };
  };

  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Métricas</h1>
          <Tooltip content="Módulo de métricas para visualizar datos de ganancias, costos, stock y ventas">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-help">
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
          </Tooltip>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-4">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <Button
            isIconOnly
            variant="light"
            onPress={handleRefresh}
            className="min-w-unit-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </Button>
        </div>
      </div>

      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        className="w-full"
      >
        <Tab key="revenue" title="Ganancias">
          <RevenueModule dateRange={dateRange} refreshKey={refreshKey} />
        </Tab>
        <Tab key="costs" title="Costos">
          <CostsModule dateRange={dateRange} refreshKey={refreshKey} />
        </Tab>
        <Tab key="stock" title="Stock">
          <StockModule dateRange={dateRange} refreshKey={refreshKey} />
        </Tab>
        <Tab key="sales" title="Ventas">
          <SalesModule dateRange={dateRange} refreshKey={refreshKey} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Metrics;