"use client";
import { Button } from "@heroui/react";
import { ReactNode, useRef, useEffect } from "react";

import OrdenDefault from "../ordenDefault";
import OrdenVer from "../ordenVer";
import OrdenForm from "../ordenForm";
import { IOrder, ORDER_UI_STATE } from "../../../../types/orders.type";

interface OrderModalProps {
    orden: IOrder | null;
    estado: ORDER_UI_STATE;
    setEstado: (nuevoEstado: ORDER_UI_STATE) => void;
    setSaveOrderCallback?: (callback: (() => void) | null) => void;
    isMobile?: boolean;
    onSave?: (order: IOrder) => void;
}

const OrderModal = ({ orden, estado, setEstado, setSaveOrderCallback, isMobile, onSave }: OrderModalProps) => {
    const formRef = useRef<{ submitForm: () => void } | null>(null);

    useEffect(() => {
        if (estado === 'nueva' && setSaveOrderCallback) {
            setSaveOrderCallback(() => formRef.current?.submitForm);
        } else {
            setSaveOrderCallback?.(null);
        }
    }, [estado, setSaveOrderCallback]);

    const componentes: Record<ORDER_UI_STATE, ReactNode> = {
        default: <OrdenDefault />,
        ver: <OrdenVer orden={orden} onClose={() => setEstado('default')} />,
        editar: <OrdenForm ref={formRef} orden={orden} isEdit={true} onSave={onSave} onClose={() => setEstado('default')} />,
        nueva: <OrdenForm ref={formRef} orden={null} isEdit={false} onSave={onSave} onClose={() => setEstado('default')} />,
    };

    return (
        <div className="flex flex-col h-full relative">
            <div className="shrink-0">
                <h1 className="font-poppins font-black text-4xl text-primary ">ORDEN</h1>
            </div>
            {/* <div className="flex flex-col h-full"> */}
            <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                {/* <div
                    style={{ background: `linear-gradient(135deg,rgba(41, 13, 27, 0.32) 0%,rgba(41, 13, 27, 0.32) 66%,rgba(41, 13, 27, 0.32) 100%)` }}
                    className="flex flex-col flex-1 w-full md:mt-5 rounded-2xl opacity-80">

                    {componentes[estado]}
                </div> */}
                <div
                    style={{
                        background:
                            "linear-gradient(135deg,rgba(41,13,27,0.32) 0%,rgba(41,13,27,0.32) 66%,rgba(41,13,27,0.32) 100%)",
                    }}
                    className="flex-1 w-full md:mt-5 rounded-2xl opacity-80 overflow-auto min-h-0"
                >
                    {/* {componentes[estado]} */}
                    <div className="h-full min-h-0">
                        {componentes[estado]}
                    </div>
                </div>
            </div>
            {!isMobile && (
                <div className="absolute bottom-4 right-4">
                    <Button
                        isIconOnly
                        color="primary"
                        size="lg"
                        onPress={() => setEstado("nueva")}
                        className="rounded-full shadow-lg"
                    >
                        +
                    </Button>
                </div>
            )}
        </div>
    )
}

export default OrderModal;
