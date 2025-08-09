// src/components/StoryGeneration.jsx
import React, { useState } from "react";
import { generateStory } from "../services/api";

const StoryGeneration = ({
  currentProject,
  setCurrentProject,
  onStoryUpdate,
}) => {
  const [formData, setFormData] = useState({
    topic: "",
    description: "",
    style: "Cartoon",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateStory = async (e) => {
    e.preventDefault();

    if (!formData.topic || !formData.description || !formData.style) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await generateStory(formData);
      const storyData = response.data;

      if (onStoryUpdate) {
        onStoryUpdate(storyData);
      }
    } catch (err) {
      console.error("Story generation failed:", err);
      setError(
        "Failed to generate story. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearForm = () => {
    setFormData({
      topic: "",
      description: "",
      style: "Cartoon",
    });
    setError(null);
  };

  const exportStoryJSON = () => {
    if (!currentProject.story) return;

    const dataStr = JSON.stringify(currentProject.story, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "story_structure.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="story-generation-component">
      {/* Story Form */}
      <div className="story-form-container">
        <div className="form-header">
          <h3>Create Your Story Structure</h3>
          <p>
            Generate the foundation of your video story with AI-powered
            narrative generation
          </p>
        </div>

        <form onSubmit={handleGenerateStory} className="story-form">
          <div className="form-group">
            <label htmlFor="story-topic">Story Topic</label>
            <input
              id="story-topic"
              type="text"
              value={formData.topic}
              onChange={(e) => handleInputChange("topic", e.target.value)}
              placeholder="Enter your story topic (e.g., 'Adventure of a young hero', 'Mystery at school')"
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="story-description">Story Description</label>
            <textarea
              id="story-description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your story in detail. Include characters, plot, setting, and key events. Be as specific as possible about what happens, who the characters are, and where the story takes place..."
              className="form-control story-textarea"
              rows="8"
              required
            />
            <small className="form-help">
              The more detailed your description, the better the generated story
              structure will be. Include character names, locations, plot
              events, and visual details.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="visual-style">Visual Style</label>
            <select
              id="visual-style"
              value={formData.style}
              onChange={(e) => handleInputChange("style", e.target.value)}
              className="form-control"
              required
            >
              <option value="">Select visual style...</option>
              <option value="Cartoon">Cartoon</option>
              <option value="Realistic">Realistic</option>
              <option value="Anime">Anime</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Vintage">Vintage</option>
              <option value="Modern">Modern</option>
              <option value="Watercolor">Watercolor</option>
              <option value="Oil Painting">Oil Painting</option>
            </select>
          </div>

          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={handleClearForm}
              className="btn btn-outline"
              disabled={loading}
            >
              Clear Form
            </button>

            <button
              type="submit"
              disabled={
                loading ||
                !formData.topic ||
                !formData.description ||
                !formData.style
              }
              className="btn btn-primary btn-generate"
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Generating Story...
                </>
              ) : (
                "Generate Story"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Story Results */}
      {currentProject.story && (
        <div className="story-results">
          <div className="results-header">
            <h3>Generated Story Structure</h3>
            <div className="results-actions">
              <button
                onClick={exportStoryJSON}
                className="btn btn-outline btn-sm"
              >
                塘 Export JSON
              </button>
            </div>
          </div>

          <div className="story-overview">
            <div className="story-meta">
              <h4>{currentProject.story.project_title}</h4>
              <p className="story-description">
                {currentProject.story.project_description}
              </p>
              <div className="story-tags">
                <span className="style-badge">
                  {currentProject.story.visual_style}
                </span>
                {currentProject.story.scenes && (
                  <span className="scenes-badge">
                    {currentProject.story.scenes.length} Scenes
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Story Scenes Preview */}
          {currentProject.story.scenes &&
            currentProject.story.scenes.length > 0 && (
              <div className="scenes-preview">
                <h4>Story Scenes ({currentProject.story.scenes.length})</h4>
                <div className="scenes-grid">
                  {currentProject.story.scenes.map((scene, index) => (
                    <div key={index} className="scene-card">
                      <div className="scene-header">
                        <h5>
                          Scene {index + 1}: {scene.scene_title}
                        </h5>
                        <span className="scene-number">#{index + 1}</span>
                      </div>

                      <p className="scene-description">
                        {scene.scene_description}
                      </p>

                      {scene.characters && scene.characters.length > 0 && (
                        <div className="scene-characters">
                          <strong>Characters in this scene:</strong>
                          <div className="character-tags">
                            {scene.characters.map((char, charIndex) => (
                              <span key={charIndex} className="character-tag">
                                {char.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {scene.actions && scene.actions.length > 0 && (
                        <div className="scene-actions-list">
                          <strong>Key Actions:</strong>
                          <ul>
                            {scene.actions
                              .slice(0, 2)
                              .map((action, actionIndex) => (
                                <li key={actionIndex}>
                                  <strong>{action.subject}</strong>{" "}
                                  {action.action}
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Story Statistics */}
          <div className="story-stats">
            <h4>Story Statistics</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">
                  {currentProject.story.scenes?.length || 0}
                </span>
                <span className="stat-label">Total Scenes</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {currentProject.story.scenes?.reduce(
                    (total, scene) => total + (scene.characters?.length || 0),
                    0
                  ) || 0}
                </span>
                <span className="stat-label">Total Characters</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {new Set(
                    currentProject.story.scenes?.flatMap(
                      (scene) =>
                        scene.characters?.map((char) => char.name) || []
                    )
                  ).size || 0}
                </span>
                <span className="stat-label">Unique Characters</span>
              </div>
            </div>
          </div>

          <div className="story-actions">
            <button
              className="btn btn-secondary"
              onClick={handleGenerateStory}
              disabled={loading}
            >
              売 Regenerate Story
            </button>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="help-section">
        <h4>庁 Tips for Better Stories</h4>
        <ul className="help-list">
          <li>
            Be specific about characters, their motivations, and relationships
          </li>
          <li>Include key plot points and the sequence of events</li>
          <li>Describe the setting and atmosphere in detail</li>
          <li>Mention any important props, locations, or visual elements</li>
          <li>Consider the emotional arc and character development</li>
          <li>Include dialogue or key interactions between characters</li>
        </ul>

        <div className="example-section">
          <h5>統 Example Story Description:</h5>
          <div className="example-text">
            "Sarah, a curious 12-year-old girl with red hair, discovers a
            magical portal in her grandmother's attic. When she steps through,
            she finds herself in a mystical forest where talking animals need
            her help to save their kingdom from an evil sorcerer. She meets
            Finn, a brave fox companion, and together they must find three
            magical crystals hidden in different locations: a crystal cave, an
            ancient temple, and a floating island. Along the way, Sarah learns
            about courage and friendship while using her intelligence to solve
            puzzles."
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryGeneration;