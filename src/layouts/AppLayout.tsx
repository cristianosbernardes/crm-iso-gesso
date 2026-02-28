import { Outlet } from 'react-router-dom';
import AppSidebar from '@/components/AppSidebar';
import Topbar from '@/components/Topbar';

const AppLayout = () => {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
