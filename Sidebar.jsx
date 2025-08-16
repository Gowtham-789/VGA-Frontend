// src/components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({
  projects,
  currentProjectId,
  onSelectProject,
  onCreateProject,
  apiKey,
  onSetApiKey,
}) => {
  const [newProjectName, setNewProjectName] = useState("");
  const location = useLocation();

  const handleCreate = () => {
    if (newProjectName.trim()) {
      onCreateProject(newProjectName.trim());
      setNewProjectName("");
    }
  };

  const tabs = [
    { id: "home", label: "Home", path: "/" },
    { id: "story", label: "Story Generation", path: "/story" },
    { id: "characters", label: "Character Images", path: "/characters" },
    { id: "backgrounds", label: "Background Images", path: "/backgrounds" },
    { id: "scenes", label: "Scene Generation", path: "/scenes" },
    { id: "preview", label: "Video Preview", path: "/preview" },
  ];

  const currentProject = projects.find((p) => p.id === currentProjectId);

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="project-section">
          <h3>Projects</h3>
          <div className="form-group">
            <input
              type="text"
              className="project-title-input"
              placeholder="New Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            <button
              onClick={handleCreate}
              className="btn btn-sm btn-primary btn-full-width mt-8"
            >
              + New Project
            </button>
          </div>
          <div className="project-selector">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                className={`nav-tab ${
                  project.id === currentProjectId ? "active" : ""
                }`}
              >
                <span>{project.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* New API Key Section */}
        <div className="api-key-section">
          <h3>API Key</h3>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter your API Key"
              value={apiKey}
              onChange={(e) => onSetApiKey(e.target.value)}
            />
          </div>
        </div>

        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <nav className="sidebar-nav">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                className={`nav-tab ${
                  location.pathname === tab.path ? "active" : ""
                }`}
              >
                <span>{tab.label}</span>
                {currentProject && (
                  <span className="nav-tab-count">
                    {tab.id === "story" && (currentProject.story ? 1 : 0)}
                    {tab.id === "characters" &&
                      (currentProject.characters?.length || 0)}
                    {tab.id === "backgrounds" &&
                      (currentProject.backgrounds?.length || 0)}
                    {tab.id === "scenes" &&
                      (currentProject.scenes?.length || 0)}
                    {tab.id === "preview" && 0}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
