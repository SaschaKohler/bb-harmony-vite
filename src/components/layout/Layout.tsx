import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import TopNavigation from "./TopNavigation";

const Layout: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNavigation />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
            <SidebarTrigger className="mb-4" />
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
