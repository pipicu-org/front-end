"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Alert } from '@heroui/react';

interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; visible: boolean } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ message, type, visible: true });
        setTimeout(() => {
            setToast(null);
        }, 6000); // Auto-hide after 3 seconds
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && toast.visible && (
                <div className="fixed top-4 right-4 z-50">
                    <Alert
                        color={toast.type === 'success' ? 'success' : toast.type === 'error' ? 'danger' : 'primary'}
                        title={toast.message}
                        onClose={() => setToast(null)}
                    />
                </div>
            )}
        </ToastContext.Provider>
    );
};