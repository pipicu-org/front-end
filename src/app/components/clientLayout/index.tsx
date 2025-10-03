"use client";
import { HeroUIProvider } from "@heroui/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Navbar from "../navbar";
import { ToastProvider } from "@/utils/toast";

const ClientLayout = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
  return (
    <>
      {/* <HeroUIProvider className="flex flex-col h-full"> */}
      <HeroUIProvider className=" flex flex-col">
        <Navbar />
        <main className="flex flex-col">
          <DndProvider backend={HTML5Backend}>
            <ToastProvider>
              {children}
            </ToastProvider>
          </DndProvider>
        </main>
      </HeroUIProvider>
    </>
  );
}

export default ClientLayout;
