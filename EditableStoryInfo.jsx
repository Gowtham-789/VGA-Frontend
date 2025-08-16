import React, { useState, useEffect } from "react";
import { updateStory } from "../services/api";

const EditableStoryInfo = ({ currentProject, setCurrentProject }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    project_title: currentProject.story?.project_title || "",
    project_description: currentProject.story?.project_description || "",
    visual_style: currentProject.story?.visual_style || "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    // Update local state if the main project state changes
    setFormData({
      project_title: currentProject.story?.project_title || "",
      project_description: currentProject.story?.project_description || "",
      visual_style: currentProject.story?.visual_style || "",
    });
  }, [currentProject.story]);

  const handleSave = async () => {
    try {
      setError(null);
      const data = {
        project_id: currentProject.id,
        story_data: formData,
      };
      await updateStory(data);
      const updatedProject = {
        ...currentProject,
        story: {
          ...currentProject.story,
          ...formData,
        },
      };
      setCurrentProject(updatedProject);
      localStorage.setItem("currentProject", JSON.stringify(updatedProject));
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update story:", err);
      setError("Failed to save changes. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      project_title: currentProject.story?.project_title || "",
      project_description: currentProject.story?.project_description || "",
      visual_style: currentProject.story?.visual_style || "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!currentProject.story) {
    return (
      <div className="story-info card">
        <h4>No Story Available</h4>
        <p>Please generate a story on the Story page.</p>
      </div>
    );
  }

  return (
    <div className="generation-section">
      <div className="story-info-editable">
        {isEditing ? (
          <div className="story-info card">
            <div className="form-group">
              <label>Story Title</label>
              <input
                type="text"
                name="project_title"
                value={formData.project_title}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Story Description</label>
              <textarea
                name="project_description"
                value={formData.project_description}
                onChange={handleInputChange}
                className="form-control"
                rows="4"
              />
            </div>
            <div className="form-group">
              <label>Visual Style</label>
              <input
                type="text"
                name="visual_style"
                value={formData.visual_style}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="story-actions">
              <button onClick={handleSave} className="btn btn--primary">
                Save
              </button>
              <button onClick={handleCancel} className="btn btn--outline">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="story-info card">
            <h4>{currentProject.story?.project_title}</h4>
            <p>{currentProject.story?.project_description}</p>
            <div className="flex justify-between items-center">
              <span className="style-badge">
                {currentProject.story?.visual_style}
              </span>
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-outline btn-sm"
              >
                Edit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditableStoryInfo;
