// src/pages/PreviewPage.jsx
import React from "react";
import { getImageUrl } from "../services/api";

const PreviewPage = ({ currentProject }) => {
  const exportProject = () => {
    const dataStr = JSON.stringify(currentProject, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${currentProject.title.replace(
      /\s+/g,
      "_"
    )}_complete_project.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const getTotalAssets = () => {
    const storyCount = currentProject.story ? 1 : 0;
    const charactersCount = currentProject.characters?.length || 0;
    const backgroundsCount = currentProject.backgrounds?.length || 0;
    const scenesCount = currentProject.scenes?.length || 0;
    return storyCount + charactersCount + backgroundsCount + scenesCount;
  };

  const getCompletionPercentage = () => {
    let completed = 0;
    let total = 4; // story, characters, backgrounds, scenes

    if (currentProject.story) completed++;
    if (currentProject.characters?.length > 0) completed++;
    if (currentProject.backgrounds?.length > 0) completed++;
    if (currentProject.scenes?.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Video Preview</h2>
        <p>Review and manage your complete video story project</p>
      </div>

      {/* Project Overview */}
      <div className="project-overview">
        <div className="overview-header">
          <h3>{currentProject.title}</h3>
          <div className="project-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${getCompletionPercentage()}%` }}
              ></div>
            </div>
            <span className="progress-text">
              {getCompletionPercentage()}% Complete
            </span>
          </div>
        </div>

        <div className="project-stats-overview">
          <div className="stat-card">
            <div className="stat-number">{getTotalAssets()}</div>
            <div className="stat-label">Total Assets</div>
          </div>

          <div className="stat-card">
            <div className="stat-number">
              {currentProject.story?.scenes?.length || 0}
            </div>
            <div className="stat-label">Story Scenes</div>
          </div>

          <div className="stat-card">
            <div className="stat-number">
              {currentProject.characters?.length || 0}
            </div>
            <div className="stat-label">Characters</div>
          </div>

          <div className="stat-card">
            <div className="stat-number">
              {currentProject.backgrounds?.length || 0}
            </div>
            <div className="stat-label">Backgrounds</div>
          </div>

          <div className="stat-card">
            <div className="stat-number">
              {currentProject.scenes?.length || 0}
            </div>
            <div className="stat-label">Compositions</div>
          </div>
        </div>
      </div>

      {/* Story Summary */}
      {currentProject.story && (
        <div className="section">
          <h3>Story Summary</h3>
          <div className="story-summary-card">
            <h4>{currentProject.story.project_title}</h4>
            <p>{currentProject.story.project_description}</p>
            <div className="story-meta">
              <span className="style-badge">
                {currentProject.story.visual_style}
              </span>
              <span className="scene-count">
                {currentProject.story.scenes?.length || 0} Scenes
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Asset Gallery */}
      <div className="section">
        <h3>Asset Gallery</h3>

        {/* Characters */}
        {currentProject.characters && currentProject.characters.length > 0 && (
          <div className="asset-category">
            <h4>Characters ({currentProject.characters.length})</h4>
            <div className="asset-grid">
              {currentProject.characters.map((character, index) => (
                <div key={index} className="asset-item">
                  {character.file_path ? (
                    <img
                      src={getImageUrl(character.file_path)}
                      alt={character.character}
                      className="asset-thumbnail"
                    />
                  ) : (
                    <div className="asset-placeholder">
                      <span>👤</span>
                    </div>
                  )}
                  <div className="asset-info">
                    <span className="asset-name">{character.character}</span>
                    <span className={`asset-status ${character.image_status}`}>
                      {character.image_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Backgrounds */}
        {currentProject.backgrounds &&
          currentProject.backgrounds.length > 0 && (
            <div className="asset-category">
              <h4>Backgrounds ({currentProject.backgrounds.length})</h4>
              <div className="asset-grid">
                {currentProject.backgrounds.map((background, index) => (
                  <div key={index} className="asset-item">
                    {background.file_path ? (
                      <img
                        src={getImageUrl(background.file_path)}
                        alt={background.scene}
                        className="asset-thumbnail"
                      />
                    ) : (
                      <div className="asset-placeholder">
                        <span>🖼️</span>
                      </div>
                    )}
                    <div className="asset-info">
                      <span className="asset-name">{background.scene}</span>
                      <span
                        className={`asset-status ${background.image_status}`}
                      >
                        {background.image_status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Scene Compositions */}
        {currentProject.scenes && currentProject.scenes.length > 0 && (
          <div className="asset-category">
            <h4>Scene Compositions ({currentProject.scenes.length})</h4>
            <div className="asset-grid">
              {currentProject.scenes.map((scene, index) => (
                <div key={index} className="asset-item">
                  {scene.composite_image ? (
                    <img
                      src={getImageUrl(scene.composite_image)}
                      alt={scene.scene_title}
                      className="asset-thumbnail"
                    />
                  ) : (
                    <div className="asset-placeholder">
                      <span>🎬</span>
                    </div>
                  )}
                  <div className="asset-info">
                    <span className="asset-name">{scene.scene_title}</span>
                    <span className={`asset-status ${scene.status}`}>
                      {scene.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Export Options */}
      <div className="section">
        <h3>Export & Share</h3>
        <div className="export-options">
          <button onClick={exportProject} className="btn btn-primary">
            📥 Export Complete Project
          </button>

          <button
            onClick={() => {
              if (currentProject.story) {
                const dataStr = JSON.stringify(currentProject.story, null, 2);
                const dataUri =
                  "data:application/json;charset=utf-8," +
                  encodeURIComponent(dataStr);
                const exportFileDefaultName = "story_only.json";

                const linkElement = document.createElement("a");
                linkElement.setAttribute("href", dataUri);
                linkElement.setAttribute("download", exportFileDefaultName);
                linkElement.click();
              }
            }}
            className="btn btn-outline"
            disabled={!currentProject.story}
          >
            📄 Export Story Only
          </button>

          <button
            onClick={() => {
              // Create a zip-like structure for all assets
              alert("Asset bundle export will be implemented");
            }}
            className="btn btn-outline"
          >
            🎨 Export All Assets
          </button>
        </div>
      </div>

      {/* Empty State */}
      {getTotalAssets() === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📹</div>
          <h3>No Content to Preview</h3>
          <p>
            Generate story, characters, backgrounds, and scenes to see your
            project preview.
          </p>
        </div>
      )}
    </div>
  );
};

export default PreviewPage;