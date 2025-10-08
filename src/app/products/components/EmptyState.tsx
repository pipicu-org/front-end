interface EmptyStateProps {
    message?: string;
    icon?: React.ReactNode;
}

const EmptyState = ({ message = "No hay datos disponibles", icon }: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            {icon && <div className="mb-4">{icon}</div>}
            <p className="text-gray-500">{message}</p>
        </div>
    );
};

export default EmptyState;