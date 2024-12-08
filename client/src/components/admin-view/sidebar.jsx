import { Fragment } from "react";
import { ChartBar, LayoutDashboard, ShoppingBasket, BadgeCent } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import PropTypes from "prop-types"; // Import PropTypes

const adminSidebarMenuItems = [
  { name: "dashboard", label: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
  { name: "products", label: "Products", path: "/admin/product", icon: <ShoppingBasket size={20} /> },
  { name: "orders", label: "Orders", path: "/admin/orders", icon: <BadgeCent size={20} /> },
];

function MenuItems({ navigate, setOpen }) {
  return (
    <nav className="mt-8 flex flex-col gap-2">
      {adminSidebarMenuItems.map((menuItem, index) => (
        <div
          key={index}
          onClick={() => {
            navigate(menuItem.path);
            if (setOpen) setOpen(false); // Close the sidebar on navigation for mobile
          }}
          className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {menuItem.icon}
          <span className="text-sm font-medium">{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
}

MenuItems.propTypes = {
  navigate: PropTypes.func.isRequired, // Validate navigate as a function
  setOpen: PropTypes.func, // Validate setOpen as a function (optional)
};

function AdminSideBar({ open, setOpen, className }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <SheetHeader className="border-b pb-4">
            <SheetTitle className="flex items-center gap-2 text-xl font-bold">
              <ChartBar size={30} />
              Admin Panel
            </SheetTitle>
          </SheetHeader>
          <MenuItems navigate={navigate} setOpen={setOpen} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col border-r ${className}`}>
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-2 pb-6"
        >
          <ChartBar size={30} />
          <h1 className="text-2xl font-extrabold">Admin Panel</h1>
        </div>
        <MenuItems navigate={navigate} />
      </aside>
    </Fragment>
  );
}

AdminSideBar.propTypes = {
  open: PropTypes.bool.isRequired, // Validate open as a boolean
  setOpen: PropTypes.func.isRequired, // Validate setOpen as a function
  className: PropTypes.string, // Validate className as a string
};

export default AdminSideBar;
