"use client";
import Order from "@/entities/order";
import { Card, CardBody } from "@heroui/react";

const OrderStateCard = ({ order: { id, name, estimatedTime } }: { order: Order }) => {
    return (
        <Card className="max-w-[400px]">
            <CardBody>
                <div className="flex gap-4 items-center">
                    <h3 className="text-lg font-semibold">{id}</h3>
                    <p className="text-sm">{name}</p>
                    <p className="text-sm">{estimatedTime} hs</p>
                </div>
            </CardBody>
        </Card>
    );
}

export default OrderStateCard;
