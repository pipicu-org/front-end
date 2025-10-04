"use client";

import { useState } from "react";
import { Tabs, Tab } from "@heroui/react";
import ProductManagement from "./components/ProductManagement";
import IngredientManagement from "./components/IngredientManagement";
import SupplierManagement from "./components/SupplierManagement";

const Products = () => {
    const [activeTab, setActiveTab] = useState("products");

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Gestión de Productos</h1>
            <Tabs
                selectedKey={activeTab}
                onSelectionChange={(key) => setActiveTab(key as string)}
                aria-label="Gestión de productos"
                className="w-full"
            >
                <Tab key="products" title="Productos">
                    <ProductManagement />
                </Tab>
                <Tab key="ingredients" title="Ingredientes">
                    <IngredientManagement />
                </Tab>
                <Tab key="suppliers" title="Proveedores">
                    <SupplierManagement />
                </Tab>
            </Tabs>
        </div>
    );
}

export default Products;
