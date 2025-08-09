// src/components/Sidebar.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ currentProject, setCurrentProject }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      id: "story",
      label: "Story Generation",
      path: "/story",
      count: currentProject.story ? 1 : 0,
    },
    {
      id: "characters",
      label: "Character Images",
      path: "/characters",
      count: currentProject.characters?.length || 0,
    },
    {
      id: "backgrounds",
      label: "Background Images",
      path: "/backgrounds",
      count: currentProject.backgrounds?.length || 0,
    },
    {
      id: "scenes",
      label: "Scene Composition",
      path: "/scenes",
      count: currentProject.scenes?.length || 0,
    },
    { id: "preview", label: "Video Preview", path: "/preview", count: 0 },
  ];

  const handleTabClick = (path) => {
    navigate(path);
  };

  const handleProjectTitleChange = (e) => {
    const newProject = { ...currentProject, title: e.target.value };
    setCurrentProject(newProject);
    localStorage.setItem("currentProject", JSON.stringify(newProject));
  };

  const generateAllAssets = async () => {
    alert("Generate All Assets functionality will be implemented");
  };

  const exportProject = () => {
    const dataStr = JSON.stringify(currentProject, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `${currentProject.title.replace(
      /\s+/g,
      "_"
    )}_project.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        {/* Current Project Section */}
        <div className="project-section">
          <h3>Current Project</h3>
          <input
            type="text"
            value={currentProject.title}
            onChange={handleProjectTitleChange}
            className="project-title-input"
            placeholder="Enter project title"
          />

          <select className="project-selector">
            <option value="">Select existing project...</option>
          </select>
        </div>

        {/* Navigation Tabs */}
        <nav className="sidebar-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${
                location.pathname === tab.path ? "active" : ""
              }`}
              onClick={() => handleTabClick(tab.path)}
            >
              <span className="nav-tab-label">{tab.label}</span>
              {tab.count > 0 && (
                <span className="nav-tab-count">{tab.count}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <button
            className="btn btn-secondary btn-full-width"
            onClick={generateAllAssets}
          >
            Generate All Assets
          </button>
          <button
            className="btn btn-outline btn-full-width"
            onClick={exportProject}
          >
            Export Project
          </button>
        </div>

        {/* Project Stats */}
        <div className="project-stats">
          <h3>Project Stats</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Story Scenes</span>
              <span className="stat-value">
                {currentProject.story?.scenes?.length || 0}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Characters</span>
              <span className="stat-value">
                {currentProject.characters?.length || 0}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Backgrounds</span>
              <span className="stat-value">
                {currentProject.backgrounds?.length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;