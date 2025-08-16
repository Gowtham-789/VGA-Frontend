// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { checkApiStatus } from "../services/api";

const Header = ({ currentProject }) => {
  const [apiStatus, setApiStatus] = useState("offline");

  useEffect(() => {
    const getStatus = async () => {
      try {
        await checkApiStatus();
        setApiStatus("online");
      } catch (error) {
        setApiStatus("offline");
      }
    };
    getStatus();
  }, []);

  // Dynamically set the status dot color based on the API status
  const getStatusColor = () => {
    switch (apiStatus) {
      case "online":
        return "#10b981"; // green
      case "offline":
        return "#ef4444"; // red
      default:
        return "#f59e0b"; // yellow
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">
            Project: {currentProject ? currentProject.name : "Loading..."}
          </h1>
          <div className="api-status">
            <span
              className="status-dot"
              style={{ backgroundColor: getStatusColor() }}
            ></span>
            <span className="status-text">API {apiStatus}</span>
          </div>
        </div>
        <div className="header-right">
          {/* Action buttons have been moved to the Sidebar */}
        </div>
      </div>
    </header>
  );
};

export default Header;
