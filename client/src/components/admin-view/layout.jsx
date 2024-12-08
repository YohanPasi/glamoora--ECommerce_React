import { Outlet } from "react-router-dom";
import AdminHeader from "./header";
import AdminSideBar from "./sidebar";
import { useState } from "react";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar (1) */}
      <AdminSideBar
        open={openSidebar}
        setOpen={setOpenSidebar}
        className="w-64 bg-gray-200"
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header (2) */}
        <AdminHeader setOpen={setOpenSidebar} className="bg-gray-100 shadow-md p-4 w-full" />

        {/* Feature Content Area (3) */}
        <main className="flex-1 bg-muted/40 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
