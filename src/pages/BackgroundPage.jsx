import React, { useState } from "react";
import { generateBackgroundImages, getImageUrl } from "../services/api";

const BackgroundPage = ({ currentProject, setCurrentProject }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generationStatus, setGenerationStatus] = useState({});

  const handleGenerateBackgrounds = async () => {
    if (!currentProject.story) {
      setError("No story available. Please generate a story first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await generateBackgroundImages({
        topic: currentProject.story.project_title,
        description: currentProject.story.project_description,
        style: currentProject.story.visual_style,
      });

      const updatedProject = {
        ...currentProject,
        backgrounds: response.data.generated_images || [],
      };

      setCurrentProject(updatedProject);
      localStorage.setItem("currentProject", JSON.stringify(updatedProject));
    } catch (err) {
      console.error("Background generation failed:", err);
      setError(
        "Failed to generate backgrounds. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateBackground = async (backgroundIndex) => {
    const background = currentProject.backgrounds[backgroundIndex];
    if (!background) return;

    setGenerationStatus((prev) => ({
      ...prev,
      [backgroundIndex]: "generating",
    }));

    try {
      const response = await generateBackgroundImages({
        topic: background.scene || "Background Scene",
        description: background.background_data_used?.description || "",
        style: background.background_data_used?.style || "Cartoon",
      });

      if (
        response.data.generated_images &&
        response.data.generated_images.length > 0
      ) {
        const updatedBackgrounds = [...currentProject.backgrounds];
        updatedBackgrounds[backgroundIndex] = {
          ...background,
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
          [backgroundIndex]: "success",
        }));
      }
    } catch (error) {
      console.error("Error regenerating background:", error);
      setGenerationStatus((prev) => ({
        ...prev,
        [backgroundIndex]: "error",
      }));
    }
  };

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
              onClick={handleGenerateBackgrounds}
              disabled={loading}
              className="btn btn-primary btn-generate"
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Generating Backgrounds...
                </>
              ) : (
                "Generate All Backgrounds"
              )}
            </button>
          </div>

          {/* Background Gallery */}
          {currentProject.backgrounds &&
            currentProject.backgrounds.length > 0 && (
              <div className="backgrounds-section">
                <h3>
                  Generated Backgrounds ({currentProject.backgrounds.length})
                </h3>

                <div className="backgrounds-grid">
                  {currentProject.backgrounds.map((background, index) => (
                    <div key={index} className="background-card">
                      <div className="background-header">
                        <h4>{background.scene || `Background ${index + 1}`}</h4>
                        <div className="background-status">
                          <span
                            className={`status-badge ${background.image_status}`}
                          >
                            {background.image_status}
                          </span>
                        </div>
                      </div>

                      <div className="background-preview">
                        {background.image_status === "success" &&
                        background.file_path ? (
                          <img
                            src={getImageUrl(background.file_path)}
                            alt={background.scene}
                            className="background-image"
                            onError={(e) => {
                              e.target.src = "/api/placeholder/300/200";
                            }}
                          />
                        ) : background.image_status === "failed" ? (
                          <div className="background-placeholder error">
                            <div className="error-icon">⚠️</div>
                            <p>Generation Failed</p>
                            <small>{background.reason}</small>
                          </div>
                        ) : (
                          <div className="background-placeholder">
                            <div className="loading-spinner"></div>
                            <p>Generating...</p>
                          </div>
                        )}
                      </div>

                      {background.background_data_used && (
                        <div className="background-details">
                          <p>
                            <strong>Description:</strong>{" "}
                            {background.background_data_used.description}
                          </p>
                          <p>
                            <strong>Style:</strong>{" "}
                            {background.background_data_used.style}
                          </p>
                        </div>
                      )}

                      <div className="background-actions">
                        <button
                          onClick={() => handleRegenerateBackground(index)}
                          disabled={generationStatus[index] === "generating"}
                          className="btn btn-outline btn-sm"
                        >
                          {generationStatus[index] === "generating"
                            ? "Regenerating..."
                            : "Regenerate"}
                        </button>

                        {background.file_path && (
                          <a
                            href={getImageUrl(background.file_path)}
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

          {/* Empty State */}
          {(!currentProject.backgrounds ||
            currentProject.backgrounds.length === 0) &&
            !loading && (
              <div className="empty-state">
                <div className="empty-icon">🖼️</div>
                <h3>No Backgrounds Generated</h3>
                <p>
                  Click "Generate All Backgrounds" to create background images
                  from your story.
                </p>
              </div>
            )}
        </>
      )}
    </div>
  );
};

export default BackgroundPage;
