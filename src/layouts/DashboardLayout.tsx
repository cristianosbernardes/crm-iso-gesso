import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto bg-background">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
