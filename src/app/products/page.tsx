"use client";

import { useState } from "react";
import { Tabs, Tab } from "@heroui/react";
import ProductManagement from "./components/ProductManagement";
import IngredientManagement from "./components/IngredientManagement";
import SupplierManagement from "./components/SupplierManagement";
import PurchaseManagement from "./components/PurchaseManagement";
import UnitManagement from "./components/UnitManagement";
import StockMovementManagement from "./components/StockMovementManagement";

const Products = () => {
    const [activeTab, setActiveTab] = useState("products");

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Gestión de Productos</h1>
            <Tabs
                selectedKey={activeTab}
                onSelectionChange={(key) => setActiveTab(key as string)}
                aria-label="Gestión de productos"
                className="w-full"
                classNames={{ tabList: "bg-gray-500/20 text-black",  tabContent: "text-black" }}
            >
                <Tab key="products" title="Productos" >
                    <ProductManagement />
                </Tab>
                <Tab key="ingredients" title="Ingredientes">
                    <IngredientManagement />
                </Tab>
                <Tab key="suppliers" title="Proveedores">
                    <SupplierManagement />
                </Tab>
                <Tab key="purchases" title="Compras">
                    <PurchaseManagement />
                </Tab>
                <Tab key="units" title="Unidades">
                    <UnitManagement />
                </Tab>
                <Tab key="stockMovements" title="Movimientos de Stock">
                    <StockMovementManagement />
                </Tab>
            </Tabs>
        </div>
    );
}

export default Products;
