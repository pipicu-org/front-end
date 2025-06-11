"use client";
import { Button, Input } from "@heroui/react";
import OrderStateColumn from "./components/orderStateColumn";

const Reception = () => {
    return (
        <>
            <div className="flex justify-between sm:flex-row gap-[16px] w-full">
                <div className="flex items-center sm:flex-row gap-[16px] w-full sm:w-auto">
                    <Button
                        variant="solid"
                        color="primary"
                        className="w-full sm:w-auto"
                    >
                        Nueva orden
                    </Button>
                    <Button
                        variant="solid"
                        color="primary"
                        className="w-full sm:w-auto"
                    >
                        Historico
                    </Button>
                </div>
                <div>
                    <Input label="Buscar" type="text" />
                </div>
            </div>
            <div className="flex gap-[16px] w-full overflow-x-auto">
                <OrderStateColumn
                    state="Creados"
                    orders={[{ id: '1', name: "esteban", estimatedTime: "10:00", state: "Creados" }]}
                />
                <OrderStateColumn
                    state="Pendientes"
                    orders={[{ id: '2', name: "esteban", estimatedTime: "10:00", state: "Pendientes" }]}
                />
                <OrderStateColumn
                    state="Preparados"
                    orders={[{ id: '3', name: "esteban", estimatedTime: "10:00", state: "Preparados" }]}
                />
                <OrderStateColumn
                    state="En camino"
                    orders={[{ id: '4', name: "esteban", estimatedTime: "10:00", state: "En camino" }]}
                />
            </div>
        </>
    );
}

export default Reception;
