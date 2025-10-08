import { Spinner } from "@heroui/react";

interface LoaderProps {
    size?: "sm" | "md" | "lg";
    message?: string;
}

const Loader = ({ size = "lg", message = "Cargando..." }: LoaderProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-8">
            <Spinner size={size} />
            {message && <p className="mt-2 text-gray-600">{message}</p>}
        </div>
    );
};

export default Loader;