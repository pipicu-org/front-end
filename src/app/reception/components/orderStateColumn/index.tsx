"use client";
import { Card, CardBody, CardFooter, CardHeader, Divider } from "@heroui/react";
import OrderStateCard from "../orderStateCard";
import Order from "@/entities/order";

const OrderStateColumn = ({ state, orders }: { state: string, orders: Order[] }) => {
    return (
        <Card className="max-w-[400px]">
            <CardHeader className="flex gap-3">
                {state}
            </CardHeader>
            <Divider />
            <CardBody>
                <ul>
                    {orders.map((order, index) => (<div key={index} className="mb-4">
                        <OrderStateCard
                            order={order}
                        />
                    </div>))}
                </ul>
            </CardBody>
            <Divider />
            <CardFooter>
                Count: 1
            </CardFooter>
        </Card>
    );
}

export default OrderStateColumn;
