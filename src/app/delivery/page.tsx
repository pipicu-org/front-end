import CardKanban from "../components/cardKanban";
import ordenesAleatorias from "../components/OrdenesAleatorias";
import { IOrder } from "../types/orders.type";

const Delivery = () => {
	const ordenes_creados:IOrder[] = [];
    const ordenes_pendientes:IOrder[] = [];
    const ordenes_preparados:IOrder[] = [];
    const ordenes_enCamino:IOrder[] = [];

    ordenesAleatorias.map( (orden) => {
        if (orden.state == "Creados"){
            ordenes_creados.push(orden)
        } else if (orden.state == "Pendientes"){
            ordenes_pendientes.push(orden)
        } else if (orden.state == "Preparados"){
            ordenes_preparados.push(orden)
        } else if (orden.state == "En camino"){
            ordenes_enCamino.push(orden)
        }
    });  

	return (
		<>
			<CardKanban estado={"Preparados"} ordenes={ordenes_preparados} ></CardKanban>
		</>
	);
}

export default Delivery;
