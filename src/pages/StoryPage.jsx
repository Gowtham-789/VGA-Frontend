// src/pages/StoryPage.jsx
import React, { useState } from "react";
import { generateStory } from "../services/api";

const StoryPage = ({ currentProject, setCurrentProject }) => {
  const [formData, setFormData] = useState({
    topic: "",
    description: "",
    style: "Cartoon",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rawJsonResponse, setRawJsonResponse] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateStory = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRawJsonResponse(null); // Clear previous response

    try {
      const response = await generateStory(formData);
      const storyData = response.data;

      // Set the raw JSON response to a state variable
      setRawJsonResponse(storyData);

      const updatedProject = {
        ...currentProject,
        story: storyData,
      };

      setCurrentProject(updatedProject);
      localStorage.setItem("currentProject", JSON.stringify(updatedProject));
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
    setRawJsonResponse(null); // Clear raw JSON on form clear
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Generate Your Story Structure</h2>
        <p>
          Create the foundation of your video story with AI-powered narrative
          generation.
        </p>
      </div>

      <div className="story-form-container">
        <form onSubmit={handleGenerateStory} className="story-form">
          <div className="form-group">
            <label htmlFor="topic">Story Topic</label>
            <input
              id="topic"
              type="text"
              value={formData.topic}
              onChange={(e) => handleInputChange("topic", e.target.value)}
              placeholder="Enter your story topic (e.g., 'Adventure of a young hero')"
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Story Description</label>
            <textarea
              id="description"
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
            <label htmlFor="style">Visual Style</label>
            <select
              id="style"
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

          {error && <div className="error-message">{error}</div>}

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

      {/* Raw JSON Display */}
      {rawJsonResponse && (
        <div className="story-results">
          <h3>Raw JSON Response</h3>
          <pre>
            <code>{JSON.stringify(rawJsonResponse, null, 2)}</code>
          </pre>
        </div>
      )}

      {/* Help Section */}
      <div className="help-section">
        <h4>💡 Tips for Better Stories</h4>
        <ul className="help-list">
          <li>
            Be specific about characters, their motivations, and relationships
          </li>
          <li>Include key plot points and the sequence of events</li>
          <li>Describe the setting and atmosphere in detail</li>
          <li>Mention any important props, locations, or visual elements</li>
          <li>Consider the emotional arc and character development</li>
        </ul>

        <div className="example-section">
          <h5>📝 Example Story Description:</h5>
          <div className="example-text">
            "Sarah, a curious 12-year-old girl with red hair, discovers a
            magical portal in her grandmother's attic. When she steps through,
            she finds herself in a mystical forest where talking animals need
            her help to save their kingdom from an evil sorcerer. She meets
            Finn, a brave fox companion, and together they must find three
            magical crystals hidden in different locations: a crystal cave, an
            ancient temple, and a floating island."
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryPage;