// components/shared/SidebarMenuItem.jsx
// import React from "react";
import { NavLink } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const SidebarMenuItem = ({ path, icon, name, exact = false }) => {
  return (
    <NavLink
      to={path}
      end={exact}
      className={({ isActive }) =>
        `flex items-center md:flex-row flex-col md:justify-start justify-center
         py-3.5 md:px-10 gap-3 ${
           isActive
             ? "bg-indigo-50 border-r-[6px] border-indigo-500/90"
             : "hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90"
         }`
      }
    >
      <img src={icon} alt="item_icon" className="w-6 h-6" />
      <p className="md:block hidden text-center">{name}</p>
    </NavLink>
  );
};

export default SidebarMenuItem;
