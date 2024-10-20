import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <nav>
        <Link
          to="/Dashboard"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
        >
          Dashboard
        </Link>
        <Link
          to="/bachbluten-rad"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
        >
          Bachblüten Rad
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
