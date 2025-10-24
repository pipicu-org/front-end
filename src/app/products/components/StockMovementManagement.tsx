"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Card, CardBody, CardHeader } from "@heroui/react";
import { motion } from "framer-motion";
import { getStockMovements } from "../../services/stockMovements.service";
import ToggleView from "./ToggleView";
import Loader from "./Loader";
import EmptyState from "./EmptyState";

const StockMovementManagement = () => {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [view, setView] = useState<"table" | "cards">("table");

    // Detect mobile
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Force cards on mobile
    useEffect(() => {
        if (isMobile) setView("cards");
    }, [isMobile]);

    // Queries
    const { data: stockMovementsData, isLoading, error } = useQuery({
        queryKey: ["stockMovements", page, limit],
        queryFn: () => getStockMovements(page, limit),
    });

    const stockMovements = stockMovementsData?.data || [];
    const total = stockMovementsData?.total || 0;

    return (
        <div className="space-y-6 flex flex-col h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-semibold">Movimientos de Stock</h2>
                <div className="flex items-center gap-2">
                    {!isMobile && <ToggleView view={view} onToggle={() => setView(view === "table" ? "cards" : "table")} />}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <EmptyState message="Error al cargar movimientos de stock" />
                ) : stockMovements.length === 0 ? (
                    <EmptyState message="No hay movimientos de stock disponibles" />
                ) : view === "table" ? (
                    <div className="h-full flex flex-col">
                        <Table aria-label="Tabla de Movimientos de Stock" className="flex-1 text-lg" isStriped>
                            <TableHeader>
                                <TableColumn>ID</TableColumn>
                                <TableColumn>Ingrediente ID</TableColumn>
                                <TableColumn>Cantidad</TableColumn>
                                <TableColumn>Unidad ID</TableColumn>
                                <TableColumn>Tipo Movimiento ID</TableColumn>
                                <TableColumn>Compra Item ID</TableColumn>
                                <TableColumn>Creado</TableColumn>
                                <TableColumn>Actualizado</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {stockMovements.map((movement) => (
                                    <TableRow key={movement.id}>
                                        <TableCell>{movement.id}</TableCell>
                                        <TableCell>{movement.ingredient.name}</TableCell>
                                        <TableCell>{movement.quantity}</TableCell>
                                        <TableCell>{movement.unit.id}</TableCell>
                                        <TableCell>{movement.stockMovementTypeId}</TableCell>
                                        <TableCell>{movement.purchaseItemId || "N/A"}</TableCell>
                                        <TableCell>{new Date(movement.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).replace(/ (\w+)/, (match, month) => ' ' + month.charAt(0).toUpperCase() + month.slice(1))}</TableCell>
                                        <TableCell>{new Date(movement.updatedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).replace(/ (\w+)/, (match, month) => ' ' + month.charAt(0).toUpperCase() + month.slice(1))}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {total > limit && (
                            <div className="flex justify-center mt-4">
                                <Pagination
                                    total={Math.ceil(total / limit)}
                                    page={page}
                                    onChange={setPage}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {stockMovements.map((movement) => (
                                <motion.div
                                    key={movement.id}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Card>
                                        <CardHeader>
                                            <h4 className="font-semibold">Movimiento {movement.id}</h4>
                                        </CardHeader>
                                        <CardBody>
                                            <p>Ingrediente ID: {movement.ingredient.id}</p>
                                            <p>Cantidad: {movement.quantity}</p>
                                            <p>Unidad ID: {movement.unit.id}</p>
                                            <p>Tipo Movimiento ID: {movement.stockMovementTypeId}</p>
                                            <p>Compra Item ID: {movement.purchaseItemId || "N/A"}</p>
                                            <p>Creado: {new Date(movement.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).replace(/ (\w+)/, (match, month) => ' ' + month.charAt(0).toUpperCase() + month.slice(1))}</p>
                                            <p>Actualizado: {new Date(movement.updatedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).replace(/ (\w+)/, (match, month) => ' ' + month.charAt(0).toUpperCase() + month.slice(1))}</p>
                                        </CardBody>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StockMovementManagement;