import React, { useState } from "react";
import {
  getImageUrl,
  generateCharacterImages,
  deleteAsset,
  customizeAsset,
} from "../services/api";
import { Link } from "react-router-dom";
import AssetPreview from "../components/AssetPreview";
import EditableStoryInfo from "../components/EditableStoryInfo";

const CharacterPage = ({ currentProject, setCurrentProject }) => {
  const [error, setError] = useState(null);
  const [generationStatus, setGenerationStatus] = useState({});

  const handleRegenerateCharacter = async (asset) => {
    const characterIndex = currentProject.characters.findIndex(
      (c) => c.id === asset.id
    );
    if (characterIndex === -1) return;

    setGenerationStatus((prev) => ({
      ...prev,
      [asset.id]: "generating",
    }));

    try {
      const response = await generateCharacterImages({
        topic: asset.character || "Character",
        description: asset.character_data_used?.name || "",
        style: currentProject.story?.visual_style || "Cartoon",
      });

      if (
        response.data.generated_images &&
        response.data.generated_images.length > 0
      ) {
        const updatedCharacters = [...currentProject.characters];
        updatedCharacters[characterIndex] = {
          ...asset,
          ...response.data.generated_images[0],
        };

        const updatedProject = {
          ...currentProject,
          characters: updatedCharacters,
        };

        setCurrentProject(updatedProject);
        localStorage.setItem("currentProject", JSON.stringify(updatedProject));
      }
    } catch (err) {
      console.error("Error regenerating character:", err);
      setError("Failed to regenerate the character. Please try again.");
    } finally {
      setGenerationStatus((prev) => ({
        ...prev,
        [asset.id]: "success",
      }));
    }
  };

  const handleDeleteCharacter = async (characterToDelete) => {
    try {
      const data = {
        project_id: currentProject.id,
        asset_id: characterToDelete.id,
        asset_type: "character",
      };
      await deleteAsset(data);

      const updatedCharacters = currentProject.characters.filter(
        (character) => character.id !== characterToDelete.id
      );

      const updatedProject = {
        ...currentProject,
        characters: updatedCharacters,
      };
      setCurrentProject(updatedProject);
      localStorage.setItem("currentProject", JSON.stringify(updatedProject));
      setError(null);
    } catch (err) {
      console.error("Failed to delete character:", err);
      setError("Failed to delete the character. Please try again.");
    }
  };

  const handleCustomizeCharacter = async ({
    asset,
    customizePrompt,
    customizeFile,
  }) => {
    try {
      const formData = new FormData();
      formData.append("project_id", currentProject.id);
      formData.append("asset_id", asset.id);
      formData.append("asset_type", "character");
      formData.append("prompt", customizePrompt);
      if (customizeFile) {
        formData.append("file", customizeFile);
      }

      const response = await customizeAsset(formData);

      const updatedCharacters = currentProject.characters.map((char) =>
        char.id === asset.id ? { ...char, ...response.data } : char
      );

      const updatedProject = {
        ...currentProject,
        characters: updatedCharacters,
      };
      setCurrentProject(updatedProject);
      localStorage.setItem("currentProject", JSON.stringify(updatedProject));
      setError(null);
    } catch (err) {
      console.error("Failed to customize character:", err);
      setError("Failed to customize the character. Please try again.");
    }
  };

  if (!currentProject) {
    return <div>Loading project...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Character Images</h2>
        <p>Generate detailed character images from your story structure</p>
      </div>

      {!currentProject.story ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No Story Available</h3>
          <p>Please generate a story first to create character images.</p>
        </div>
      ) : (
        <>
          <EditableStoryInfo
            currentProject={currentProject}
            setCurrentProject={setCurrentProject}
          />

          {error && <div className="error-message">{error}</div>}

          {currentProject.characters && currentProject.characters.length > 0 ? (
            <div className="characters-section">
              <h3>Generated Characters ({currentProject.characters.length})</h3>

              <div className="characters-grid">
                {currentProject.characters.map((character, index) => (
                  <AssetPreview
                    key={character.id || index}
                    asset={character}
                    type="character"
                    onRegenerate={() => handleRegenerateCharacter(character)}
                    onDelete={() => handleDeleteCharacter(character)}
                    onCustomize={handleCustomizeCharacter}
                    isRegenerating={
                      generationStatus[character.id] === "generating"
                    }
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No Characters Generated</h3>
              <p>
                Character images will appear here once generated from your
                story.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CharacterPage;
