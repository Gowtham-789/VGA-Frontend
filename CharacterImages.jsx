// src/components/CharacterImages.jsx
import React, { useState } from "react";
import { generateCharacterImages } from "../services/api";
import AssetPreview from "./AssetPreview";

const CharacterImages = ({
  currentProject,
  setCurrentProject,
  characters = [],
  onCharactersUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [regeneratingIndex, setRegeneratingIndex] = useState(null);

  const handleGenerateCharacters = async () => {
    if (!currentProject.story) {
      setError("No story available. Please generate a story first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await generateCharacterImages({
        topic: currentProject.story.project_title,
        description: currentProject.story.project_description,
        style: currentProject.story.visual_style,
      });

      const newCharacters = response.data.generated_images || [];

      if (onCharactersUpdate) {
        onCharactersUpdate(newCharacters);
      }
    } catch (err) {
      console.error("Character generation failed:", err);
      setError(
        "Failed to generate characters. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateCharacter = async (character, index) => {
    setRegeneratingIndex(index);

    try {
      const response = await generateCharacterImages({
        topic: character.character || "Character",
        description: character.character_data_used?.name || "",
        style: currentProject.story?.visual_style || "Cartoon",
      });

      if (
        response.data.generated_images &&
        response.data.generated_images.length > 0
      ) {
        const updatedCharacters = [...characters];
        updatedCharacters[index] = {
          ...character,
          ...response.data.generated_images[0],
        };

        if (onCharactersUpdate) {
          onCharactersUpdate(updatedCharacters);
        }
      }
    } catch (error) {
      console.error("Error regenerating character:", error);
      setError("Failed to regenerate character. Please try again.");
    } finally {
      setRegeneratingIndex(null);
    }
  };

  const handleDownload = (imageUrl) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "character.png";
    link.click();
  };

  const getCharacterDetails = (character) => {
    if (!character.character_data_used) return null;

    const details = character.character_data_used.character_details;
    if (!details) return null;

    return (
      <div className="character-details-info">
        <p>
          <strong>Name:</strong> {character.character_data_used.name}
        </p>
        <p>
          <strong>Species:</strong> {details.species_or_race}
        </p>
        <p>
          <strong>Age:</strong> {details.age_category}
        </p>
        <p>
          <strong>Eyes:</strong> {details.eyes}
        </p>
        {details.head_features && (
          <p>
            <strong>Features:</strong> {details.head_features}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="character-images-component">
      {!currentProject.story ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No Story Available</h3>
          <p>Please generate a story first to create character images.</p>
        </div>
      ) : (
        <>
          {/* Story Info and Generation */}
          <div className="generation-section">
            <div className="current-story-info">
              <h4>Current Story: {currentProject.story.project_title}</h4>
              <p>{currentProject.story.project_description}</p>
              <span className="style-badge">
                {currentProject.story.visual_style}
              </span>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              onClick={handleGenerateCharacters}
              disabled={loading}
              className="btn btn-primary btn-generate"
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Generating Characters...
                </>
              ) : (
                "Generate All Characters"
              )}
            </button>
          </div>

          {/* Characters Grid */}
          {characters.length > 0 && (
            <div className="characters-grid-section">
              <h3>Generated Characters ({characters.length})</h3>

              <div className="assets-grid">
                {characters.map((character, index) => (
                  <div key={index} className="character-card-wrapper">
                    <AssetPreview
                      asset={character}
                      type="character"
                      onRegenerate={(asset) =>
                        handleRegenerateCharacter(asset, index)
                      }
                      onDownload={handleDownload}
                      isRegenerating={regeneratingIndex === index}
                    />

                    {/* Additional Character Details */}
                    {getCharacterDetails(character) && (
                      <div className="character-extended-details">
                        {getCharacterDetails(character)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Character Statistics */}
          {characters.length > 0 && (
            <div className="character-stats">
              <h4>Character Statistics</h4>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-number">
                    {
                      characters.filter((c) => c.image_status === "success")
                        .length
                    }
                  </span>
                  <span className="stat-label">Successful</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {
                      characters.filter((c) => c.image_status === "failed")
                        .length
                    }
                  </span>
                  <span className="stat-label">Failed</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{characters.length}</span>
                  <span className="stat-label">Total</span>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {characters.length === 0 && !loading && (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No Characters Generated</h3>
              <p>
                Click "Generate All Characters" to create character images from
                your story.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CharacterImages;