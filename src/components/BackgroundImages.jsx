import React, { useState } from "react";
import { generateBackgroundImages, getImageUrl } from "../services/api";
import AssetPreview from "./AssetPreview";

const BackgroundImages = ({
  currentProject,
  setCurrentProject,
  backgrounds = [],
  onBackgroundsUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [regeneratingIndex, setRegeneratingIndex] = useState(null);
  const [formData, setFormData] = useState({
    topic: "",
    description: "",
    style: "Cartoon",
  });

  const handleGenerateFromForm = async (e) => {
    e.preventDefault();
    if (!formData.topic || !formData.description) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await generateBackgroundImages(formData);
      const newBackgrounds = response.data.generated_images || [];

      if (onBackgroundsUpdate) {
        onBackgroundsUpdate(newBackgrounds);
      }
    } catch (err) {
      console.error("Background generation failed:", err);
      setError(
        "Failed to generate backgrounds. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFromStory = async () => {
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

      const newBackgrounds = response.data.generated_images || [];

      if (onBackgroundsUpdate) {
        onBackgroundsUpdate(newBackgrounds);
      }
    } catch (err) {
      console.error("Background generation failed:", err);
      setError(
        "Failed to generate backgrounds. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateBackground = async (background, index) => {
    setRegeneratingIndex(index);

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
        const updatedBackgrounds = [...backgrounds];
        updatedBackgrounds[index] = {
          ...background,
          ...response.data.generated_images[0],
        };

        if (onBackgroundsUpdate) {
          onBackgroundsUpdate(updatedBackgrounds);
        }
      }
    } catch (error) {
      console.error("Error regenerating background:", error);
      setError("Failed to regenerate background. Please try again.");
    } finally {
      setRegeneratingIndex(null);
    }
  };

  const handleDownload = (imageUrl) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "background.png";
    link.click();
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="background-images-component">
      {/* Generation Form */}
      <div className="generation-form-section">
        <h3>Generate New Backgrounds</h3>

        <form onSubmit={handleGenerateFromForm} className="background-form">
          <div className="form-row">
            <div className="form-group">
              <label>Background Topic</label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => handleInputChange("topic", e.target.value)}
                placeholder="e.g., Enchanted Forest, Modern City"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Visual Style</label>
              <select
                value={formData.style}
                onChange={(e) => handleInputChange("style", e.target.value)}
                className="form-control"
              >
                <option value="Cartoon">Cartoon</option>
                <option value="Realistic">Realistic</option>
                <option value="Anime">Anime</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Vintage">Vintage</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Background Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the background scene in detail..."
              className="form-control"
              rows="3"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Generating...
                </>
              ) : (
                "Generate Backgrounds"
              )}
            </button>

            {currentProject.story && (
              <button
                type="button"
                onClick={handleGenerateFromStory}
                disabled={loading}
                className="btn btn-secondary"
              >
                Generate from Story
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Story Info */}
      {currentProject.story && (
        <div className="current-story-info">
          <h4>Current Story: {currentProject.story.project_title}</h4>
          <p>{currentProject.story.project_description}</p>
          <span className="style-badge">
            {currentProject.story.visual_style}
          </span>
        </div>
      )}

      {/* Backgrounds Grid */}
      {backgrounds.length > 0 && (
        <div className="backgrounds-grid-section">
          <h3>Generated Backgrounds ({backgrounds.length})</h3>

          <div className="assets-grid">
            {backgrounds.map((background, index) => (
              <AssetPreview
                key={index}
                asset={background}
                type="background"
                onRegenerate={(asset) =>
                  handleRegenerateBackground(asset, index)
                }
                onDownload={handleDownload}
                isRegenerating={regeneratingIndex === index}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {backgrounds.length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-icon">🖼️</div>
          <h3>No Backgrounds Generated</h3>
          <p>
            Create stunning backgrounds for your story scenes using the form
            above.
          </p>
        </div>
      )}
    </div>
  );
};

export default BackgroundImages;
