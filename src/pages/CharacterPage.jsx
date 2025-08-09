// src/pages/CharacterPage.jsx
import React, { useState } from "react";
import { generateCharacterImages, getImageUrl } from "../services/api";

const CharacterPage = ({ currentProject, setCurrentProject }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generationStatus, setGenerationStatus] = useState({});

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

      const updatedProject = {
        ...currentProject,
        characters: response.data.generated_images || [],
      };

      setCurrentProject(updatedProject);
      localStorage.setItem("currentProject", JSON.stringify(updatedProject));
    } catch (err) {
      console.error("Character generation failed:", err);
      setError(
        "Failed to generate characters. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateCharacter = async (characterIndex) => {
    const character = currentProject.characters[characterIndex];
    if (!character) return;

    setGenerationStatus((prev) => ({
      ...prev,
      [characterIndex]: "generating",
    }));

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
        const updatedCharacters = [...currentProject.characters];
        updatedCharacters[characterIndex] = {
          ...character,
          ...response.data.generated_images[0],
        };

        const updatedProject = {
          ...currentProject,
          characters: updatedCharacters,
        };

        setCurrentProject(updatedProject);
        localStorage.setItem("currentProject", JSON.stringify(updatedProject));

        setGenerationStatus((prev) => ({
          ...prev,
          [characterIndex]: "success",
        }));
      }
    } catch (error) {
      console.error("Error regenerating character:", error);
      setGenerationStatus((prev) => ({
        ...prev,
        [characterIndex]: "error",
      }));
    }
  };

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
          <div className="generation-section">
            <div className="story-info">
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
          {currentProject.characters &&
            currentProject.characters.length > 0 && (
              <div className="characters-section">
                <h3>
                  Generated Characters ({currentProject.characters.length})
                </h3>

                <div className="characters-grid">
                  {currentProject.characters.map((character, index) => (
                    <div key={index} className="character-card">
                      <div className="character-header">
                        <h4>
                          {character.character || `Character ${index + 1}`}
                        </h4>
                        <div className="character-status">
                          <span
                            className={`status-badge ${character.image_status}`}
                          >
                            {character.image_status}
                          </span>
                        </div>
                      </div>

                      <div className="character-preview">
                        {character.image_status === "success" &&
                        character.file_path ? (
                          <img
                            src={getImageUrl(character.file_path)}
                            alt={character.character}
                            className="character-image"
                            onError={(e) => {
                              e.target.src = "/api/placeholder/300/400";
                            }}
                          />
                        ) : character.image_status === "failed" ? (
                          <div className="character-placeholder error">
                            <div className="error-icon">⚠️</div>
                            <p>Generation Failed</p>
                            <small>{character.reason}</small>
                          </div>
                        ) : (
                          <div className="character-placeholder">
                            <div className="loading-spinner"></div>
                            <p>Generating...</p>
                          </div>
                        )}
                      </div>

                      {character.character_data_used && (
                        <div className="character-details">
                          <h5>Character Details</h5>
                          <p>
                            <strong>Name:</strong>{" "}
                            {character.character_data_used.name}
                          </p>
                          {character.character_data_used.character_details && (
                            <div className="character-attributes">
                              <p>
                                <strong>Species:</strong>{" "}
                                {
                                  character.character_data_used
                                    .character_details.species_or_race
                                }
                              </p>
                              <p>
                                <strong>Age:</strong>{" "}
                                {
                                  character.character_data_used
                                    .character_details.age_category
                                }
                              </p>
                              <p>
                                <strong>Eyes:</strong>{" "}
                                {
                                  character.character_data_used
                                    .character_details.eyes
                                }
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="character-actions">
                        <button
                          onClick={() => handleRegenerateCharacter(index)}
                          disabled={generationStatus[index] === "generating"}
                          className="btn btn-outline btn-sm"
                        >
                          {generationStatus[index] === "generating"
                            ? "Regenerating..."
                            : "Regenerate"}
                        </button>

                        {character.file_path && (
                          <a
                            href={getImageUrl(character.file_path)}
                            download
                            className="btn btn-outline btn-sm"
                          >
                            Download
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Empty State for Characters */}
          {(!currentProject.characters ||
            currentProject.characters.length === 0) &&
            !loading && (
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <h3>No Characters Generated</h3>
                <p>
                  Click "Generate All Characters" to create character images
                  from your story.
                </p>
              </div>
            )}
        </>
      )}
    </div>
  );
};

export default CharacterPage;