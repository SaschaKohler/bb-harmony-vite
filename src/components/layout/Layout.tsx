import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* <AppSidebar /> */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
