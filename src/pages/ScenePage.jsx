// src/pages/ScenePage.jsx
import React, { useState } from "react";
import { generateSceneComposition, getImageUrl } from "../services/api";
import AssetPreview from "../components/AssetPreview";

const ScenePage = ({
  currentProject,
  setCurrentProject,
  scenes = [],
  onScenesUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [regeneratingIndex, setRegeneratingIndex] = useState(null);

  const handleGenerateScenes = async () => {
    if (!currentProject.story) {
      setError("No story available. Please generate a story first.");
      return;
    }

    if (!currentProject.characters || currentProject.characters.length === 0) {
      setError("No characters available. Please generate characters first.");
      return;
    }

    if (
      !currentProject.backgrounds ||
      currentProject.backgrounds.length === 0
    ) {
      setError("No backgrounds available. Please generate backgrounds first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await generateSceneComposition({
        topic: currentProject.story.project_title,
        description: currentProject.story.project_description,
        style: currentProject.story.visual_style,
      });

      const newScenes = response.data.generated_scenes || [];

      if (onScenesUpdate) {
        onScenesUpdate(newScenes);
      }
    } catch (err) {
      console.error("Scene generation failed:", err);
      setError(
        "Failed to generate scenes. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateScene = async (scene, index) => {
    setRegeneratingIndex(index);

    try {
      const response = await generateSceneComposition({
        topic: scene.scene_title || "Scene Composition",
        description: `Character: ${scene.character}, Scene: ${scene.scene_title}`,
        style: currentProject.story?.visual_style || "Cartoon",
      });

      if (
        response.data.generated_scenes &&
        response.data.generated_scenes.length > 0
      ) {
        const updatedScenes = [...scenes];
        updatedScenes[index] = {
          ...scene,
          ...response.data.generated_scenes[0],
        };

        if (onScenesUpdate) {
          onScenesUpdate(updatedScenes);
        }
      }
    } catch (error) {
      console.error("Error regenerating scene:", error);
      setError("Failed to regenerate scene. Please try again.");
    } finally {
      setRegeneratingIndex(null);
    }
  };

  const handleDownload = (imageUrl) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "scene.png";
    link.click();
  };

  const canGenerateScenes = () => {
    return (
      currentProject.story &&
      currentProject.characters &&
      currentProject.characters.length > 0 &&
      currentProject.backgrounds &&
      currentProject.backgrounds.length > 0
    );
  };

  const getPrerequisiteStatus = (type) => {
    switch (type) {
      case "story":
        return currentProject.story ? "completed" : "pending";
      case "characters":
        return currentProject.characters?.length > 0 ? "completed" : "pending";
      case "backgrounds":
        return currentProject.backgrounds?.length > 0 ? "completed" : "pending";
      default:
        return "pending";
    }
  };

  return (
    <div className="scene-page-component">
      {!currentProject.story ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No Story Available</h3>
          <p>Please generate a story first to create scene compositions.</p>
        </div>
      ) : (
        <>
          {/* Story Info */}
          <div className="generation-section">
            <div className="current-story-info">
              <h4>Current Story: {currentProject.story.project_title}</h4>
              <p>{currentProject.story.project_description}</p>
              <span className="style-badge">
                {currentProject.story.visual_style}
              </span>
            </div>

            {/* Prerequisites Check */}
            <div className="prerequisites-check">
              <h4>Prerequisites</h4>
              <p className="prerequisites-description">
                All assets must be generated before creating scene compositions
              </p>
              <div className="prerequisites-grid">
                <div
                  className={`prerequisite-item ${getPrerequisiteStatus(
                    "story"
                  )}`}
                >
                  <span className="prerequisite-icon">
                    {getPrerequisiteStatus("story") === "completed"
                      ? "✅"
                      : "⏳"}
                  </span>
                  <div className="prerequisite-info">
                    <span className="prerequisite-label">Story Generated</span>
                    <span className="prerequisite-status">
                      {currentProject.story ? "Ready" : "Pending"}
                    </span>
                  </div>
                </div>

                <div
                  className={`prerequisite-item ${getPrerequisiteStatus(
                    "characters"
                  )}`}
                >
                  <span className="prerequisite-icon">
                    {getPrerequisiteStatus("characters") === "completed"
                      ? "✅"
                      : "⏳"}
                  </span>
                  <div className="prerequisite-info">
                    <span className="prerequisite-label">Characters</span>
                    <span className="prerequisite-status">
                      {currentProject.characters?.length || 0} Generated
                    </span>
                  </div>
                </div>

                <div
                  className={`prerequisite-item ${getPrerequisiteStatus(
                    "backgrounds"
                  )}`}
                >
                  <span className="prerequisite-icon">
                    {getPrerequisiteStatus("backgrounds") === "completed"
                      ? "✅"
                      : "⏳"}
                  </span>
                  <div className="prerequisite-info">
                    <span className="prerequisite-label">Backgrounds</span>
                    <span className="prerequisite-status">
                      {currentProject.backgrounds?.length || 0} Generated
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              onClick={handleGenerateScenes}
              disabled={loading || !canGenerateScenes()}
              className="btn btn-primary btn-generate"
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Generating Scene Compositions...
                </>
              ) : (
                "Generate Scene Compositions"
              )}
            </button>

            {!canGenerateScenes() && (
              <p className="help-text">
                Please generate story, characters, and backgrounds first to
                create scene compositions.
              </p>
            )}
          </div>

          {/* Scene Composition Preview */}
          {scenes.length > 0 && (
            <div className="scenes-grid-section">
              <h3>Generated Scene Compositions ({scenes.length})</h3>

              <div className="assets-grid">
                {scenes.map((scene, index) => (
                  <div key={index} className="scene-composition-card">
                    <AssetPreview
                      asset={scene}
                      type="scene"
                      onRegenerate={(asset) =>
                        handleRegenerateScene(asset, index)
                      }
                      onDownload={handleDownload}
                      isRegenerating={regeneratingIndex === index}
                    />

                    {/* Scene Details */}
                    <div className="scene-composition-details">
                      <div className="scene-info">
                        <p>
                          <strong>Character:</strong> {scene.character}
                        </p>
                        <p>
                          <strong>Scene:</strong> {scene.scene_title}
                        </p>
                        <div className="scene-status-info">
                          <span
                            className={`scene-status-badge ${scene.status}`}
                          >
                            {scene.status === "completed"
                              ? "✅ Complete"
                              : scene.status === "failed"
                              ? "❌ Failed"
                              : "⏳ Processing"}
                          </span>
                        </div>
                      </div>

                      {scene.error && (
                        <div className="scene-error-info">
                          <strong>Error:</strong> {scene.error}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scene Composition Guide */}
          {canGenerateScenes() && scenes.length === 0 && !loading && (
            <div className="composition-guide">
              <h4>🎬 Scene Composition Process</h4>
              <div className="guide-steps">
                <div className="guide-step">
                  <span className="step-number">1</span>
                  <div className="step-content">
                    <h5>Character Integration</h5>
                    <p>
                      Characters from your story will be placed into appropriate
                      backgrounds
                    </p>
                  </div>
                </div>
                <div className="guide-step">
                  <span className="step-number">2</span>
                  <div className="step-content">
                    <h5>Scene Context</h5>
                    <p>
                      AI will consider scene descriptions and character actions
                      for placement
                    </p>
                  </div>
                </div>
                <div className="guide-step">
                  <span className="step-number">3</span>
                  <div className="step-content">
                    <h5>Visual Harmony</h5>
                    <p>
                      Lighting, shadows, and perspective will be adjusted for
                      realism
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Scene Statistics */}
          {scenes.length > 0 && (
            <div className="scene-stats">
              <h4>Composition Statistics</h4>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-number">
                    {scenes.filter((s) => s.status === "completed").length}
                  </span>
                  <span className="stat-label">Completed</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {scenes.filter((s) => s.status === "failed").length}
                  </span>
                  <span className="stat-label">Failed</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{scenes.length}</span>
                  <span className="stat-label">Total Scenes</span>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {scenes.length === 0 && !loading && canGenerateScenes() && (
            <div className="empty-state">
              <div className="empty-icon">🎬</div>
              <h3>No Scene Compositions Generated</h3>
              <p>
                Click "Generate Scene Compositions" to create final scenes
                combining your characters and backgrounds.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ScenePage;