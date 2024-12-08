import { Button } from "../ui/button";
import { AlignJustify } from "lucide-react";
import PropTypes from "prop-types"; // Import PropTypes

function AdminHeader({ setOpen, className }) {
  return (
    <header className={`flex items-center justify-between px-4 py-3 ${className}`}>
      <Button
        className="lg:hidden sm:block bg-gray-700 hover:bg-gray-600 text-white"
        onClick={() => setOpen((prev) => !prev)} // Toggle the sidebar
      >
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
    </header>
  );
}

AdminHeader.propTypes = {
  setOpen: PropTypes.func.isRequired, // Validate setOpen as a function
  className: PropTypes.string, // Validate className as a string
};

export default AdminHeader;
