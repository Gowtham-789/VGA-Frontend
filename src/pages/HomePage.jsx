// src/pages/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = ({ currentProject }) => {
  const navigate = useNavigate();

  const getProjectStats = () => {
    const hasStory = !!currentProject.story;
    const charactersCount = currentProject.characters?.length || 0;
    const backgroundsCount = currentProject.backgrounds?.length || 0;
    const scenesCount = currentProject.scenes?.length || 0;

    const completedTasks = [
      hasStory,
      charactersCount > 0,
      backgroundsCount > 0,
      scenesCount > 0,
    ].filter(Boolean).length;
    const totalTasks = 4;
    const completionPercentage = Math.round(
      (completedTasks / totalTasks) * 100
    );

    return {
      hasStory,
      charactersCount,
      backgroundsCount,
      scenesCount,
      completedTasks,
      totalTasks,
      completionPercentage,
    };
  };

  const stats = getProjectStats();

  const getNextStep = () => {
    if (!stats.hasStory) {
      return {
        title: "Generate Your Story",
        description:
          "Start by creating the narrative foundation for your video",
        action: () => navigate("/story"),
        icon: "📝",
      };
    } else if (stats.charactersCount === 0) {
      return {
        title: "Create Characters",
        description: "Generate character images from your story",
        action: () => navigate("/characters"),
        icon: "👥",
      };
    } else if (stats.backgroundsCount === 0) {
      return {
        title: "Build Backgrounds",
        description: "Create environment images for your scenes",
        action: () => navigate("/backgrounds"),
        icon: "🖼️",
      };
    } else if (stats.scenesCount === 0) {
      return {
        title: "Compose Scenes",
        description: "Combine characters and backgrounds into final scenes",
        action: () => navigate("/scenes"),
        icon: "🎬",
      };
    } else {
      return {
        title: "Preview Video",
        description: "Review and export your complete video project",
        action: () => navigate("/preview"),
        icon: "📹",
      };
    }
  };

  const nextStep = getNextStep();

  const quickActions = [
    {
      title: "Story Generation",
      description: "Create narrative structure",
      path: "/story",
      icon: "📚",
      completed: stats.hasStory,
    },
    {
      title: "Character Images",
      description: `${stats.charactersCount} characters`,
      path: "/characters",
      icon: "👤",
      completed: stats.charactersCount > 0,
    },
    {
      title: "Background Images",
      description: `${stats.backgroundsCount} backgrounds`,
      path: "/backgrounds",
      icon: "🏞️",
      completed: stats.backgroundsCount > 0,
    },
    {
      title: "Scene Composition",
      description: `${stats.scenesCount} scenes`,
      path: "/scenes",
      icon: "🎭",
      completed: stats.scenesCount > 0,
    },
  ];

  return (
    <div className="homepage">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1>Welcome to Story Video Builder</h1>
          <p className="welcome-description">
            Transform your stories into stunning visual narratives using
            AI-powered generation tools. Create characters, backgrounds, and
            complete scene compositions with ease.
          </p>
        </div>

        <div className="project-status">
          <h3>{currentProject.title}</h3>
          <div className="progress-overview">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${stats.completionPercentage}%` }}
              ></div>
            </div>
            <span className="progress-text">
              {stats.completionPercentage}% Complete ({stats.completedTasks}/
              {stats.totalTasks} tasks)
            </span>
          </div>
        </div>
      </div>

      {/* Next Step */}
      <div className="next-step-section">
        <h2>🎯 Next Step</h2>
        <div className="next-step-card" onClick={nextStep.action}>
          <div className="step-icon">{nextStep.icon}</div>
          <div className="step-content">
            <h3>{nextStep.title}</h3>
            <p>{nextStep.description}</p>
          </div>
          <div className="step-arrow">→</div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="quick-actions-section">
        <h2>🚀 Quick Actions</h2>
        <div className="actions-grid">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className={`action-card ${
                action.completed ? "completed" : "pending"
              }`}
              onClick={() => navigate(action.path)}
            >
              <div className="action-header">
                <span className="action-icon">{action.icon}</span>
                <div className="action-status">
                  {action.completed ? (
                    <span className="status-check">✅</span>
                  ) : (
                    <span className="status-pending">⏳</span>
                  )}
                </div>
              </div>
              <div className="action-content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {(stats.hasStory ||
        stats.charactersCount > 0 ||
        stats.backgroundsCount > 0) && (
        <div className="recent-activity-section">
          <h2>📊 Project Overview</h2>
          <div className="activity-grid">
            {stats.hasStory && (
              <div className="activity-item">
                <div className="activity-icon">📖</div>
                <div className="activity-content">
                  <h4>Story Created</h4>
                  <p>{currentProject.story.project_title}</p>
                  <small>
                    {currentProject.story.scenes?.length || 0} scenes planned
                  </small>
                </div>
              </div>
            )}

            {stats.charactersCount > 0 && (
              <div className="activity-item">
                <div className="activity-icon">👥</div>
                <div className="activity-content">
                  <h4>Characters Generated</h4>
                  <p>{stats.charactersCount} character images created</p>
                  <small>
                    {
                      currentProject.characters?.filter(
                        (c) => c.image_status === "success"
                      ).length
                    }{" "}
                    successful
                  </small>
                </div>
              </div>
            )}

            {stats.backgroundsCount > 0 && (
              <div className="activity-item">
                <div className="activity-icon">🏞️</div>
                <div className="activity-content">
                  <h4>Backgrounds Created</h4>
                  <p>{stats.backgroundsCount} background images generated</p>
                  <small>
                    {
                      currentProject.backgrounds?.filter(
                        (b) => b.image_status === "success"
                      ).length
                    }{" "}
                    successful
                  </small>
                </div>
              </div>
            )}

            {stats.scenesCount > 0 && (
              <div className="activity-item">
                <div className="activity-icon">🎬</div>
                <div className="activity-content">
                  <h4>Scenes Composed</h4>
                  <p>{stats.scenesCount} scene compositions created</p>
                  <small>
                    {
                      currentProject.scenes?.filter(
                        (s) => s.status === "completed"
                      ).length
                    }{" "}
                    completed
                  </small>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="tips-section">
        <h2>💡 Tips for Better Results</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">✍️</div>
            <div className="tip-content">
              <h4>Detailed Descriptions</h4>
              <p>
                The more specific your story descriptions, the better the AI can
                understand and visualize your narrative.
              </p>
            </div>
          </div>

          <div className="tip-card">
            <div className="tip-icon">🎨</div>
            <div className="tip-content">
              <h4>Consistent Style</h4>
              <p>
                Choose one visual style and stick with it throughout your
                project for cohesive results.
              </p>
            </div>
          </div>

          <div className="tip-card">
            <div className="tip-icon">🔄</div>
            <div className="tip-content">
              <h4>Iterate and Refine</h4>
              <p>
                Don't hesitate to regenerate assets until you get the perfect
                result for your story.
              </p>
            </div>
          </div>

          <div className="tip-card">
            <div className="tip-icon">📱</div>
            <div className="tip-content">
              <h4>Save Your Progress</h4>
              <p>
                Use the save project feature to preserve your work and continue
                later.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;