// src/components/Header.jsx
import React from "react";

const Header = ({ apiStatus, onNewProject, onSaveProject }) => {
  const getStatusColor = () => {
    switch (apiStatus) {
      case "connected":
        return "#10b981";
      case "error":
        return "#ef4444";
      default:
        return "#f59e0b";
    }
  };

  const getStatusText = () => {
    switch (apiStatus) {
      case "connected":
        return "API Ready (Demo Mode)";
      case "error":
        return "API Error";
      default:
        return "Checking...";
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">Story Video Builder</h1>
          <div className="api-status">
            <span
              className="status-dot"
              style={{ backgroundColor: getStatusColor() }}
            />
            <span className="status-text">{getStatusText()}</span>
          </div>
        </div>

        <div className="header-right">
          <button className="btn btn-outline" onClick={onNewProject}>
            New Project
          </button>
          <button className="btn btn-primary" onClick={onSaveProject}>
            Save Project
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;