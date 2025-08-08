import React, { useState } from "react";
import { getImageUrl } from "../services/api";

const VideoPreview = ({ currentProject }) => {
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [exportFormat, setExportFormat] = useState("mp4");
  const [isExporting, setIsExporting] = useState(false);

  const getAllAssets = () => {
    const assets = [];

    // Add characters
    if (currentProject.characters) {
      currentProject.characters.forEach((char, index) => {
        assets.push({
          id: `char-${index}`,
          type: "character",
          name: char.character || `Character ${index + 1}`,
          status: char.image_status,
          filePath: char.file_path,
          thumbnail: char.file_path ? getImageUrl(char.file_path) : null,
        });
      });
    }

    // Add backgrounds
    if (currentProject.backgrounds) {
      currentProject.backgrounds.forEach((bg, index) => {
        assets.push({
          id: `bg-${index}`,
          type: "background",
          name: bg.scene || `Background ${index + 1}`,
          status: bg.image_status,
          filePath: bg.file_path,
          thumbnail: bg.file_path ? getImageUrl(bg.file_path) : null,
        });
      });
    }

    // Add scene compositions
    if (currentProject.scenes) {
      currentProject.scenes.forEach((scene, index) => {
        assets.push({
          id: `scene-${index}`,
          type: "scene",
          name: scene.scene_title || `Scene ${index + 1}`,
          status: scene.status,
          filePath: scene.composite_image,
          thumbnail: scene.composite_image
            ? getImageUrl(scene.composite_image)
            : null,
        });
      });
    }

    return assets;
  };

  const toggleAssetSelection = (assetId) => {
    setSelectedAssets((prev) =>
      prev.includes(assetId)
        ? prev.filter((id) => id !== assetId)
        : [...prev, assetId]
    );
  };

  const selectAllAssets = () => {
    const allAssets = getAllAssets();
    setSelectedAssets(allAssets.map((asset) => asset.id));
  };

  const deselectAllAssets = () => {
    setSelectedAssets([]);
  };

  const handleExportVideo = async () => {
    if (selectedAssets.length === 0) {
      alert("Please select at least one asset to export");
      return;
    }

    setIsExporting(true);

    // Simulate video export process
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      alert(`Video exported successfully as ${exportFormat.toUpperCase()}!`);
    } catch (error) {
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const downloadAsset = (asset) => {
    if (asset.thumbnail) {
      const link = document.createElement("a");
      link.href = asset.thumbnail;
      link.download = `${asset.name.replace(/\s+/g, "_")}.png`;
      link.click();
    }
  };

  const getCompletionStats = () => {
    const allAssets = getAllAssets();
    const completed = allAssets.filter(
      (asset) => asset.status === "success" || asset.status === "completed"
    ).length;
    const total = allAssets.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
  };

  const stats = getCompletionStats();
  const allAssets = getAllAssets();

  return (
    <div className="video-preview-component">
      {/* Project Overview */}
      <div className="project-overview-section">
        <div className="overview-header">
          <h3>{currentProject.title}</h3>
          <div className="project-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${stats.percentage}%` }}
              ></div>
            </div>
            <span className="progress-text">{stats.percentage}% Complete</span>
          </div>
        </div>

        <div className="project-summary">
          {currentProject.story && (
            <div className="story-summary">
              <h4>Story: {currentProject.story.project_title}</h4>
              <p>{currentProject.story.project_description}</p>
              <span className="style-badge">
                {currentProject.story.visual_style}
              </span>
            </div>
          )}

          <div className="completion-stats">
            <div className="stat-item">
              <span className="stat-number">{stats.completed}</span>
              <span className="stat-label">Assets Ready</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total Assets</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {currentProject.story?.scenes?.length || 0}
              </span>
              <span className="stat-label">Story Scenes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Selection */}
      <div className="asset-selection-section">
        <div className="selection-header">
          <h3>Select Assets for Video ({selectedAssets.length} selected)</h3>
          <div className="selection-actions">
            <button
              onClick={selectAllAssets}
              className="btn btn-outline btn-sm"
            >
              Select All
            </button>
            <button
              onClick={deselectAllAssets}
              className="btn btn-outline btn-sm"
            >
              Clear Selection
            </button>
          </div>
        </div>

        {allAssets.length > 0 ? (
          <div className="asset-grid">
            {allAssets.map((asset) => (
              <div
                key={asset.id}
                className={`asset-preview-item ${
                  selectedAssets.includes(asset.id) ? "selected" : ""
                }`}
                onClick={() => toggleAssetSelection(asset.id)}
              >
                <div className="asset-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedAssets.includes(asset.id)}
                    onChange={() => toggleAssetSelection(asset.id)}
                  />
                </div>

                <div className="asset-thumbnail-container">
                  {asset.thumbnail ? (
                    <img
                      src={asset.thumbnail}
                      alt={asset.name}
                      className="asset-thumbnail"
                    />
                  ) : (
                    <div className="asset-placeholder">
                      <span className="asset-type-icon">
                        {asset.type === "character"
                          ? "👤"
                          : asset.type === "background"
                          ? "🖼️"
                          : "🎬"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="asset-info">
                  <div className="asset-header">
                    <span className="asset-name">{asset.name}</span>
                    <span className={`asset-status ${asset.status}`}>
                      {asset.status === "success" ||
                      asset.status === "completed"
                        ? "✅"
                        : asset.status === "failed"
                        ? "❌"
                        : "⏳"}
                    </span>
                  </div>
                  <span className="asset-type">{asset.type}</span>
                </div>

                <div className="asset-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadAsset(asset);
                    }}
                    className="btn btn-outline btn-xs"
                    disabled={!asset.thumbnail}
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📹</div>
            <h3>No Assets Available</h3>
            <p>
              Generate story, characters, backgrounds, and scenes to preview
              your video.
            </p>
          </div>
        )}
      </div>

      {/* Video Export */}
      {allAssets.length > 0 && (
        <div className="video-export-section">
          <h3>Export Video</h3>

          <div className="export-settings">
            <div className="setting-group">
              <label>Export Format</label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="form-control"
              >
                <option value="mp4">MP4 (Recommended)</option>
                <option value="mov">MOV</option>
                <option value="avi">AVI</option>
                <option value="gif">GIF</option>
              </select>
            </div>

            <div className="setting-group">
              <label>Quality</label>
              <select className="form-control">
                <option value="high">High Quality (1080p)</option>
                <option value="medium">Medium Quality (720p)</option>
                <option value="low">Low Quality (480p)</option>
              </select>
            </div>

            <div className="setting-group">
              <label>Duration per Scene</label>
              <select className="form-control">
                <option value="3">3 seconds</option>
                <option value="5">5 seconds</option>
                <option value="10">10 seconds</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          <div className="export-actions">
            <button
              onClick={handleExportVideo}
              disabled={isExporting || selectedAssets.length === 0}
              className="btn btn-primary btn-large"
            >
              {isExporting ? (
                <>
                  <span className="loading-spinner"></span>
                  Exporting Video...
                </>
              ) : (
                `🎬 Export Video (${selectedAssets.length} assets)`
              )}
            </button>

            <div className="export-info">
              <p>Selected {selectedAssets.length} assets for export</p>
              <p>Estimated video length: {selectedAssets.length * 5} seconds</p>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Preview */}
      {selectedAssets.length > 0 && (
        <div className="timeline-preview-section">
          <h3>Video Timeline Preview</h3>
          <div className="timeline">
            {selectedAssets.map((assetId, index) => {
              const asset = allAssets.find((a) => a.id === assetId);
              return (
                <div key={assetId} className="timeline-item">
                  <div className="timeline-thumbnail">
                    {asset?.thumbnail ? (
                      <img src={asset.thumbnail} alt={asset.name} />
                    ) : (
                      <div className="timeline-placeholder">
                        {asset?.type === "character"
                          ? "👤"
                          : asset?.type === "background"
                          ? "🖼️"
                          : "🎬"}
                      </div>
                    )}
                  </div>
                  <div className="timeline-info">
                    <span className="timeline-name">{asset?.name}</span>
                    <span className="timeline-duration">5s</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPreview;
