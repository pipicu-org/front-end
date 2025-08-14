"use client";
import { HeroUIProvider } from "@heroui/react";
import Navbar from "../navbar";

const ClientLayout = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
  return (
    <>
      {/* <HeroUIProvider className="flex flex-col h-full"> */}
      <HeroUIProvider className="h-screen flex flex-col">
        <Navbar />
        <main className="flex flex-col">
          {children}
        </main>
      </HeroUIProvider>
    </>
  );
}

export default ClientLayout;
