// src/components/AssetPreview.jsx
import React, { useState } from "react";
import { getImageUrl } from "../services/api";

const AssetPreview = ({
  asset,
  type,
  onRegenerate,
  onDownload,
  onDelete,
  onCustomize,
  isRegenerating = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [customizePrompt, setCustomizePrompt] = useState("");
  const [customizeFile, setCustomizeFile] = useState(null);

  const getImagePath = () => {
    return asset.file_path || asset.composite_image;
  };

  const imageUrl = getImageUrl(getImagePath(), type);

  const getAssetIcon = () => {
    switch (type) {
      case "character":
        return "👤";
      case "background":
        return "🖼️";
      case "scene":
        return "🎬";
      default:
        return "📁";
    }
  };

  const getAssetName = () => {
    switch (type) {
      case "character":
        return asset.character || asset.name || "Character";
      case "background":
        return asset.scene || asset.topic || "Background";
      case "scene":
        return asset.scene_title || "Scene";
      default:
        return "Asset";
    }
  };

  const getAssetStatus = () => {
    return asset.image_status || asset.status || "unknown";
  };

  const handleDownload = () => {
    const imagePath = getImagePath();
    if (imagePath && onDownload) {
      onDownload(getImageUrl(imagePath, type));
    }
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (onCustomize) {
      onCustomize({ asset, customizePrompt, customizeFile });
    }
    setCustomizePrompt("");
    setCustomizeFile(null);
    setShowCustomizeModal(false);
  };

  return (
    <>
      <div className="asset-preview-card">
        <div className="asset-header">
          <div className="asset-title">
            <span className="asset-icon">{getAssetIcon()}</span>
            <h4>{getAssetName()}</h4>
          </div>
          <span className={`status-badge ${getAssetStatus()}`}>
            {getAssetStatus()}
          </span>
        </div>

        <div
          className="asset-image-container"
          onMouseEnter={() =>
            getAssetStatus() === "success" && setIsHovered(true)
          }
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() =>
            getAssetStatus() === "success" && setIsHovered(true)
          }
          onTouchEnd={() => setIsHovered(false)}
        >
          {getAssetStatus() === "success" && imageUrl ? (
            <img
              src={imageUrl}
              alt={getAssetName()}
              className="asset-image"
              onError={(e) => {
                e.target.src = "/api/placeholder/300/200";
              }}
            />
          ) : getAssetStatus() === "failed" ? (
            <div className="asset-placeholder error">
              <div className="error-icon">⚠️</div>
              <p>Generation Failed</p>
              {asset.reason && <small>{asset.reason}</small>}
            </div>
          ) : isRegenerating ? (
            <div className="asset-placeholder generating">
              <div className="loading-spinner"></div>
              <p>Regenerating...</p>
            </div>
          ) : (
            <div className="asset-placeholder">
              <span className="placeholder-icon">{getAssetIcon()}</span>
              <p>No Image</p>
            </div>
          )}

          {isHovered && (
            <div className="image-preview-modal">
              <div className="modal-content">
                <img
                  src={imageUrl}
                  alt={getAssetName()}
                  className="enlarged-image"
                />
              </div>
            </div>
          )}
        </div>

        <div className="asset-details">
          {type === "character" && asset.character_data_used && (
            <div className="character-info">
              <p>
                <strong>Name:</strong> {asset.character_data_used.name}
              </p>
              {asset.character_data_used.character_details && (
                <>
                  <p>
                    <strong>Type:</strong>{" "}
                    {
                      asset.character_data_used.character_details
                        .species_or_race
                    }
                  </p>
                  <p>
                    <strong>Age:</strong>{" "}
                    {asset.character_data_used.character_details.age_category}
                  </p>
                </>
              )}
            </div>
          )}
          {type === "background" && asset.background_data_used && (
            <div className="background-info">
              <p>
                <strong>Scene:</strong> {asset.background_data_used.scene}
              </p>
              <p>
                <strong>Style:</strong> {asset.background_data_used.style}
              </p>
            </div>
          )}
          {type === "scene" && (
            <div className="scene-info">
              <p>
                <strong>Character:</strong> {asset.character}
              </p>
              <p>
                <strong>Status:</strong> {asset.status}
              </p>
            </div>
          )}
        </div>

        <div className="asset-actions">
          {onRegenerate && (
            <button
              onClick={() => onRegenerate(asset)}
              disabled={isRegenerating}
              className="btn btn-outline btn-sm"
            >
              {isRegenerating ? "Regenerating..." : "Regenerate"}
            </button>
          )}

          {onCustomize && (
            <button
              onClick={() => setShowCustomizeModal(true)}
              className="btn btn-outline btn-sm"
            >
              Customize
            </button>
          )}

          {getImagePath() && onDownload && (
            <button onClick={handleDownload} className="btn btn-outline btn-sm">
              Download
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(asset)}
              className="btn btn-outline btn-sm btn-danger"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {showCustomizeModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Customize Asset</h3>
            <p>
              Provide a new prompt or upload an image to customize this asset.
            </p>
            <form onSubmit={handleModalSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="prompt-input">New Prompt:</label>
                <textarea
                  id="prompt-input"
                  value={customizePrompt}
                  onChange={(e) => setCustomizePrompt(e.target.value)}
                  className="form-control"
                  rows="3"
                  placeholder="e.g., Change the character's hairstyle to short and spiky."
                />
              </div>
              <div className="form-group">
                <label htmlFor="file-input">Or, Upload New Image:</label>
                <input
                  type="file"
                  id="file-input"
                  onChange={(e) => setCustomizeFile(e.target.files[0])}
                  className="form-control"
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowCustomizeModal(false)}
                  className="btn btn--outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary">
                  Apply Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AssetPreview;
