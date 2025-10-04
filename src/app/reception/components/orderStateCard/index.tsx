"use client";
import { IOrder as Order } from "../../../types/orders.type";
import { Card, CardBody } from "@heroui/react";

const OrderStateCard = ({ order: { id, name, deliveryTime } }: { order: Order }) => {
    return (
        <Card className="max-w-[400px]">
            <CardBody>
                <div className="flex gap-4 items-center">
                    <h3 className="text-lg font-semibold">{id}</h3>
                    <p className="text-sm">{name}</p>
                    <p className="text-sm">{deliveryTime} hs</p>
                </div>
            </CardBody>
        </Card>
    );
}

export default OrderStateCard;
