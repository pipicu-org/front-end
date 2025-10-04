"use client";
import { HeroUIProvider } from "@heroui/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "../navbar";
import { ToastProvider } from "@/utils/toast";

const queryClient = new QueryClient();

const ClientLayout = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
  return (
    <>
      {/* <HeroUIProvider className="flex flex-col h-full"> */}
      <HeroUIProvider className=" flex flex-col">
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <main className="flex flex-col">
            <DndProvider backend={HTML5Backend}>
              <ToastProvider>
                {children}
              </ToastProvider>
            </DndProvider>
          </main>
        </QueryClientProvider>
      </HeroUIProvider>
    </>
  );
}

export default ClientLayout;
