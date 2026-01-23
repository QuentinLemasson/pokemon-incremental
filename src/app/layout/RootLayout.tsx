import { Outlet } from 'react-router-dom';

export const RootLayout = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Outlet />
    </div>
  );
};
