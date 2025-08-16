import React, { useState } from "react";
import {
  deleteAsset,
  customizeAsset,
  getImageUrl,
  postToMaster, // Use the correct master endpoint
} from "../services/api";
import { Link } from "react-router-dom";
import AssetPreview from "../components/AssetPreview";
import EditableStoryInfo from "../components/EditableStoryInfo";

const ScenePage = ({ currentProject, setCurrentProject }) => {
  const [error, setError] = useState(null);
  const [regeneratingIndex, setRegeneratingIndex] = useState(null);

  const isReady =
    currentProject.story &&
    currentProject.characters.length > 0 &&
    currentProject.backgrounds.length > 0;

  const handleRegenerateScene = async (scene, index) => {
    setRegeneratingIndex(index);
    try {
      const response = await postToMaster(currentProject);
      if (
        response.data.generated_scenes &&
        response.data.generated_scenes.length > 0
      ) {
        const updatedScenes = [...currentProject.scenes];
        updatedScenes[index] = {
          ...scene,
          ...response.data.generated_scenes[0],
        };
        const updatedProject = { ...currentProject, scenes: updatedScenes };
        setCurrentProject(updatedProject);
        localStorage.setItem("currentProject", JSON.stringify(updatedProject));
      }
    } catch (error) {
      console.error("Error regenerating scene:", error);
      setError("Failed to regenerate scene. Please try again.");
    } finally {
      setRegeneratingIndex(null);
    }
  };

  const handleDeleteScene = async (sceneToDelete) => {
    try {
      const data = {
        project_id: currentProject.id,
        asset_id: sceneToDelete.id,
        asset_type: "scene",
      };
      await deleteAsset(data);

      const updatedScenes = currentProject.scenes.filter(
        (scene) => scene.id !== sceneToDelete.id
      );

      const updatedProject = { ...currentProject, scenes: updatedScenes };
      setCurrentProject(updatedProject);
      localStorage.setItem("currentProject", JSON.stringify(updatedProject));
    } catch (err) {
      console.error("Failed to delete scene:", err);
      setError("Failed to delete the scene. Please try again.");
    }
  };

  const handleCustomizeScene = async ({
    asset,
    customizePrompt,
    customizeFile,
  }) => {
    try {
      const formData = new FormData();
      formData.append("project_id", currentProject.id);
      formData.append("asset_id", asset.id);
      formData.append("asset_type", "scene");
      formData.append("prompt", customizePrompt);
      if (customizeFile) {
        formData.append("file", customizeFile);
      }

      const response = await customizeAsset(formData);

      const updatedScenes = currentProject.scenes.map((sc) =>
        sc.id === asset.id ? { ...sc, ...response.data } : sc
      );

      const updatedProject = {
        ...currentProject,
        scenes: updatedScenes,
      };
      setCurrentProject(updatedProject);
      localStorage.setItem("currentProject", JSON.stringify(updatedProject));
      setError(null);
    } catch (err) {
      console.error("Failed to customize scene:", err);
      setError("Failed to customize the scene. Please try again.");
    }
  };

  if (!currentProject) {
    return <div>Loading project...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Scene Composition</h2>
        <p>
          Generate scene compositions by combining your story, characters, and
          backgrounds. Once ready, you can preview the final video.
        </p>
      </div>

      {currentProject.story && (
        <EditableStoryInfo
          currentProject={currentProject}
          setCurrentProject={setCurrentProject}
        />
      )}

      <div className="generation-section">
        <h3>Prerequisites</h3>
        <p className="prerequisites-description">
          All assets must be generated before creating scene compositions.
        </p>
        <div className="prerequisites-grid">
          <div
            className={`prerequisite-item ${
              currentProject.story ? "completed" : "pending"
            }`}
          >
            <span className="prerequisite-icon">
              {currentProject.story ? "✅" : "⏳"}
            </span>
            <div className="prerequisite-info">
              <span className="prerequisite-label">Story Generated</span>
              <span className="prerequisite-status">
                {currentProject.story ? "Ready" : "Pending"}
              </span>
            </div>
          </div>
          <div
            className={`prerequisite-item ${
              currentProject.characters.length > 0 ? "completed" : "pending"
            }`}
          >
            <span className="prerequisite-icon">
              {currentProject.characters.length > 0 ? "✅" : "⏳"}
            </span>
            <div className="prerequisite-info">
              <span className="prerequisite-label">Characters</span>
              <span className="prerequisite-status">
                {currentProject.characters.length} Generated
              </span>
            </div>
          </div>
          <div
            className={`prerequisite-item ${
              currentProject.backgrounds.length > 0 ? "completed" : "pending"
            }`}
          >
            <span className="prerequisite-icon">
              {currentProject.backgrounds.length > 0 ? "✅" : "⏳"}
            </span>
            <div className="prerequisite-info">
              <span className="prerequisite-label">Backgrounds</span>
              <span className="prerequisite-status">
                {currentProject.backgrounds.length} Generated
              </span>
            </div>
          </div>
        </div>
        {!isReady && (
          <p className="help-text">
            Please visit the
            <Link to="/story">Story</Link>,
            <Link to="/characters">Characters</Link>, and
            <Link to="/backgrounds">Backgrounds</Link> pages.
          </p>
        )}
      </div>

      <div className="generation-actions">
        {currentProject.scenes.length > 0 && (
          <Link to="/preview" className="btn btn-secondary">
            Go to Video Preview
          </Link>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="scenes-grid-section">
        <h3>Generated Scenes ({currentProject.scenes.length})</h3>
        {currentProject.scenes.length > 0 ? (
          <div className="assets-grid">
            {currentProject.scenes.map((scene, index) => (
              <AssetPreview
                key={scene.id || index}
                asset={{
                  ...scene,
                  path: scene.file_path,
                  prompt: scene.scene_title,
                }}
                type="scene"
                onRegenerate={() => handleRegenerateScene(scene, index)}
                onDelete={() => handleDeleteScene(scene)}
                onCustomize={handleCustomizeScene}
                onDownload={(imageUrl) => {}}
                isRegenerating={regeneratingIndex === index}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No scenes have been generated yet.</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScenePage;
