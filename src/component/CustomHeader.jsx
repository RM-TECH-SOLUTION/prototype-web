import React from "react";
import { Link } from "react-router-dom";
import "./CustomHeader.css";

const CustomHeader = ({ uiConfig = {} }) => {
  const headerBgColor = uiConfig?.headerBgColor || "#000";
  const headerIconColor = uiConfig?.headerIconColor || "#E50914";

  return (
    <header style={{ backgroundColor: headerBgColor }} className="custom-header">
      <div className="header-left">
        <img
          src={uiConfig?.headerLogo || "https://via.placeholder.com/60"}
          alt="Logo"
          className="header-logo"
        />
      </div>
      <div className="header-right">
        <Link to="/checkout" className="cart-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke={headerIconColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </Link>
      </div>
    </header>
  );
};

export default CustomHeader;

