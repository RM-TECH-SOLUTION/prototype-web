import React from "react";
import { Link, useLocation } from "react-router-dom";
import CustomHeader from "./CustomHeader";
import "./HomeTabs.css";

const HomeTabs = ({ children, uiConfig = {} }) => {
  const location = useLocation();
  const tabActiveColor = uiConfig?.tabActiveColor || "#E50914";
  const tabInactiveColor = uiConfig?.tabInactiveColor || "#777";
  const tabBgColor = uiConfig?.tabBgColor || "#111";
  
  const { pathname } = location;
  
  return (
    <div className="home-tabs-container">
      <CustomHeader uiConfig={uiConfig} />
      
      <nav style={{ backgroundColor: tabBgColor }} className="tab-nav">
        <Link 
          to="/" 
          className={`tab-link ${pathname === "/" ? "active" : ""}`}
          style={{ color: pathname === "/" ? tabActiveColor : tabInactiveColor }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>Home</span>
        </Link>
        
        <Link 
          to="/categories" 
          className={`tab-link ${pathname === "/categories" ? "active" : ""}`}
          style={{ color: pathname === "/categories" ? tabActiveColor : tabInactiveColor }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span>Order</span>
        </Link>
        
        <Link 
          to="/account" 
          className={`tab-link ${pathname === "/account" ? "active" : ""}`}
          style={{ color: pathname === "/account" ? tabActiveColor : tabInactiveColor }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>Account</span>
        </Link>
      </nav>

      <main className="tab-content">
        {children}
      </main>
    </div>
  );
};

export default HomeTabs;

