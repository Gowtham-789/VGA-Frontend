import React, { useState } from "react";
import {
  getImageUrl,
  generateBackgroundImages,
  deleteAsset,
  customizeAsset,
} from "../services/api";
import { Link } from "react-router-dom";
import AssetPreview from "../components/AssetPreview";
import EditableStoryInfo from "../components/EditableStoryInfo";

const BackgroundPage = ({ currentProject, setCurrentProject }) => {
  const [error, setError] = useState(null);
  const [generationStatus, setGenerationStatus] = useState({});

  const handleRegenerateBackground = async (asset) => {
    const backgroundIndex = currentProject.backgrounds.findIndex(
      (bg) => bg.id === asset.id
    );
    if (backgroundIndex === -1) return;

    setGenerationStatus((prev) => ({
      ...prev,
      [asset.id]: "generating",
    }));

    try {
      const response = await generateBackgroundImages({
        topic: asset.scene || "Background Scene",
        description: asset.background_data_used?.description || "",
        style: currentProject.story?.visual_style || "Cartoon",
      });

      if (
        response.data.generated_images &&
        response.data.generated_images.length > 0
      ) {
        const updatedBackgrounds = [...currentProject.backgrounds];
        updatedBackgrounds[backgroundIndex] = {
          ...asset,
          ...response.data.generated_images[0],
        };

        const updatedProject = {
          ...currentProject,
          backgrounds: updatedBackgrounds,
        };

        setCurrentProject(updatedProject);
        localStorage.setItem("currentProject", JSON.stringify(updatedProject));

        setGenerationStatus((prev) => ({
          ...prev,
          [asset.id]: "success",
        }));
      }
    } catch (error) {
      console.error("Error regenerating background:", error);
      setGenerationStatus((prev) => ({
        ...prev,
        [asset.id]: "error",
      }));
    }
  };

  const handleDeleteBackground = async (backgroundToDelete) => {
    try {
      const data = {
        project_id: currentProject.id,
        asset_id: backgroundToDelete.id,
        asset_type: "background",
      };
      await deleteAsset(data);

      const updatedBackgrounds = currentProject.backgrounds.filter(
        (background) => background.id !== backgroundToDelete.id
      );

      const updatedProject = {
        ...currentProject,
        backgrounds: updatedBackgrounds,
      };
      setCurrentProject(updatedProject);
      localStorage.setItem("currentProject", JSON.stringify(updatedProject));
      setError(null);
    } catch (err) {
      console.error("Failed to delete background:", err);
      setError("Failed to delete the background. Please try again.");
    }
  };

  const handleCustomizeBackground = async ({
    asset,
    customizePrompt,
    customizeFile,
  }) => {
    try {
      const formData = new FormData();
      formData.append("project_id", currentProject.id);
      formData.append("asset_id", asset.id);
      formData.append("asset_type", "background");
      formData.append("prompt", customizePrompt);
      if (customizeFile) {
        formData.append("file", customizeFile);
      }

      const response = await customizeAsset(formData);

      const updatedBackgrounds = currentProject.backgrounds.map((bg) =>
        bg.id === asset.id ? { ...bg, ...response.data } : bg
      );

      const updatedProject = {
        ...currentProject,
        backgrounds: updatedBackgrounds,
      };
      setCurrentProject(updatedProject);
      localStorage.setItem("currentProject", JSON.stringify(updatedProject));
      setError(null);
    } catch (err) {
      console.error("Failed to customize background:", err);
      setError("Failed to customize the background. Please try again.");
    }
  };

  if (!currentProject) {
    return <div>Loading project...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Background Images</h2>
        <p>
          Generate stunning backgrounds and environments for your story scenes
        </p>
      </div>

      {!currentProject.story ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No Story Available</h3>
          <p>Please generate a story first to create background images.</p>
        </div>
      ) : (
        <>
          <EditableStoryInfo
            currentProject={currentProject}
            setCurrentProject={setCurrentProject}
          />

          {error && <div className="error-message">{error}</div>}

          {currentProject.backgrounds &&
          currentProject.backgrounds.length > 0 ? (
            <div className="backgrounds-section">
              <h3>
                Generated Backgrounds ({currentProject.backgrounds.length})
              </h3>
              <div className="backgrounds-grid">
                {currentProject.backgrounds.map((background) => (
                  <AssetPreview
                    key={background.id}
                    asset={background}
                    type="background"
                    onRegenerate={() => handleRegenerateBackground(background)}
                    onDownload={(imageUrl) => {
                      // Download logic here, if needed
                    }}
                    onDelete={() => handleDeleteBackground(background)}
                    onCustomize={handleCustomizeBackground}
                    isRegenerating={
                      generationStatus[background.id] === "generating"
                    }
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🌆</div>
              <h3>No Backgrounds Generated</h3>
              <p>
                Background images will appear here once generated from your
                story.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BackgroundPage;
