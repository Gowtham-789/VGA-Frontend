import React, { useState, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Inline SVG icons
const SvgImage = (
  <svg
    width="31"
    height="31"
    style={{ marginRight: 14 }}
    viewBox="0 0 24 24"
    fill="none"
  >
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="4"
      stroke="#fff"
      strokeWidth="2"
    />
    <circle cx="9" cy="10" r="2" fill="#fff" />
    <rect x="10" y="14" width="7" height="4" rx="1.5" fill="#fff" />
  </svg>
);
const SvgAudio = (
  <svg
    width="32"
    height="32"
    style={{ marginRight: 14 }}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path d="M4 17V7a2 2 0 012-2h2v14H6a2 2 0 01-2-2z" fill="#fff" />
    <rect x="10" y="9" width="10" height="6" rx="2" fill="#21d184" />
  </svg>
);

const ACCENT = "#0078d4";
const ACCENT_GREEN = "#21d184";
const BG_DARK = "#181a20";
const BG_TIMELINE = "#23242c";
const BG_SIDEBAR = "#25272d";
const BG_ITEM = "#21222a";
const BOX_SHADOW = "0 4px 20px #0004";

const VideoStitchingPage = ({
  currentProject = { title: "Untitled Project" },
  setCurrentProject,
}) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [audioFile, setAudioFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const timelineAudioInputRef = useRef(null);

  // Drag & drop
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(selectedImages);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setSelectedImages(reordered);
  };

  // Upload handlers
  const handleImageImport = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages((prev) => [...prev, ...files]);
  };
  const handleAudioImport = (e) => setAudioFile(e.target.files[0]);
  const handleTimelineAudioImport = (e) => setAudioFile(e.target.files[0]);
  const removeImage = (idx) =>
    setSelectedImages((prev) => prev.filter((_, i) => i !== idx));
  const removeAudio = () => setAudioFile(null);

  // Export handler
  const handleStitch = async () => {
    if (!selectedImages.length)
      return setError("Please select at least one image.");
    if (!audioFile) return setError("Please add an audio track.");
    setIsProcessing(true);
    setError(null);
    setVideoUrl(null);
    try {
      setTimeout(() => {
        setVideoUrl("https://www.w3schools.com/html/mov_bbb.mp4");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2500);
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: BG_DARK,
        color: "#fff",
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 310,
          background: BG_SIDEBAR,
          borderRight: "2px solid #1a1a22",
          display: "flex",
          flexDirection: "column",
          boxShadow: BOX_SHADOW,
        }}
      >
        <div
          style={{
            padding: 26,
            borderBottom: "2.5px solid #23242c",
            display: "flex",
            alignItems: "center",
          }}
        >
          {SvgImage}
          <h2 style={{ fontWeight: 700, fontSize: 26, margin: 0 }}>
            Media Library
          </h2>
        </div>
        <div
          style={{
            padding: "22px 32px 10px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
              background: ACCENT,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "14px 0",
              fontWeight: 650,
              fontSize: 17,
              cursor: "pointer",
              boxShadow: BOX_SHADOW,
            }}
            onClick={() => fileInputRef.current.click()}
          >
            {SvgImage}
            <span>Import images</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={handleImageImport}
          />
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
              background: ACCENT_GREEN,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "14px 0",
              fontWeight: 650,
              fontSize: 17,
              cursor: "pointer",
              boxShadow: BOX_SHADOW,
            }}
            onClick={() => audioInputRef.current.click()}
          >
            {SvgAudio}
            <span>Add audio</span>
          </button>
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            style={{ display: "none" }}
            onChange={handleAudioImport}
          />
        </div>
        <div style={{ padding: "0 32px" }}>
          <h4 style={{ fontSize: 16, fontWeight: 500, margin: "22px 0 8px" }}>
            Images
          </h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
            {selectedImages.length === 0 && (
              <span style={{ color: "#bbb", fontSize: 13 }}>No images</span>
            )}
            {selectedImages.map((img, idx) => (
              <div
                key={idx}
                style={{
                  position: "relative",
                  width: 58,
                  height: 38,
                  borderRadius: 8,
                  overflow: "hidden",
                  boxShadow: BOX_SHADOW,
                  background: BG_ITEM,
                  marginBottom: 2,
                  marginRight: 2,
                }}
              >
                <img
                  src={URL.createObjectURL(img)}
                  alt="scene"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <button
                  onClick={() => removeImage(idx)}
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    width: 19,
                    height: 19,
                    borderRadius: "50%",
                    background: ACCENT,
                    color: "#fff",
                    border: "none",
                    fontSize: 16,
                    cursor: "pointer",
                    boxShadow: "0 1px 4px #0003",
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <h4 style={{ fontSize: 16, fontWeight: 500, margin: "22px 0 8px" }}>
            Audio
          </h4>
          {audioFile ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#384fd5",
                borderRadius: 7,
                padding: "8px 14px",
                gap: 10,
                marginBottom: 8,
              }}
            >
              {SvgAudio}
              <span
                style={{
                  fontSize: 15,
                  color: "#dcf5ee",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flex: 1,
                }}
              >
                {audioFile.name}
              </span>
              <button
                onClick={removeAudio}
                style={{
                  width: 19,
                  height: 19,
                  borderRadius: "50%",
                  background: "#111",
                  color: "#fff",
                  border: "none",
                  fontSize: 17,
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>
          ) : (
            <span style={{ color: "#bbb", fontSize: 15 }}>
              No audio selected
            </span>
          )}
        </div>
      </aside>

      {/* Main Panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Title bar */}
        <div
          style={{
            background: "#23242e",
            padding: "16px 0 8px 58px",
            borderBottom: "2px solid #23242c",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: ".01em",
          }}
        >
          {currentProject.title}
        </div>
        {/* Preview area */}
        <div
          style={{
            flex: 1,
            background: `linear-gradient(180deg, #2c2c34 0%, #20212b 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            boxShadow: "0 1px 24px #0003",
          }}
        >
          <div
            style={{
              width: "90%",
              maxWidth: 1060,
              aspectRatio: "16/9",
              borderRadius: 24,
              background: "#23232e",
              boxShadow: "0 7px 32px #0006",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {videoUrl ? (
              <video
                src={videoUrl}
                controls
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 24,
                  background: "#000",
                }}
              />
            ) : (
              <div
                style={{
                  color: "#bbb",
                  textAlign: "center",
                  width: "100%",
                  fontSize: 23,
                  height: "90%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 58,
                    marginBottom: 14,
                    background: "linear-gradient(135deg,#7f8cff,#3f3fc7)",
                    borderRadius: "32%",
                    width: 72,
                    height: 72,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px #232d",
                  }}
                >
                  🎬
                </div>
                <span style={{ fontSize: 20 }}>
                  Your video preview will appear here
                </span>
              </div>
            )}
          </div>
          {/* Controls */}
          <div
            style={{
              position: "absolute",
              top: 30,
              right: 84,
              display: "flex",
              gap: "22px",
            }}
          >
            <button
              style={{
                background: ACCENT,
                color: "#fff",
                fontWeight: 700,
                fontSize: 17,
                border: "none",
                borderRadius: 8,
                padding: "15px 38px",
                cursor: isProcessing ? "not-allowed" : "pointer",
                boxShadow: BOX_SHADOW,
                opacity: isProcessing ? 0.7 : 1,
              }}
              disabled={isProcessing}
              onClick={handleStitch}
            >
              {isProcessing ? "Processing..." : "Export video"}
            </button>
            {videoUrl && (
              <a
                href={videoUrl}
                download={(currentProject.title || "edited_video") + ".mp4"}
                style={{
                  background: ACCENT_GREEN,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 17,
                  borderRadius: 8,
                  padding: "15px 42px",
                  textDecoration: "none",
                  boxShadow: BOX_SHADOW,
                }}
              >
                Download
              </a>
            )}
          </div>
          {error && (
            <div
              style={{
                position: "absolute",
                top: 36,
                left: 60,
                color: "#e74c3c",
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}
          {/* Export success toast */}
          {showToast && (
            <div
              style={{
                position: "absolute",
                top: 20,
                left: "50%",
                transform: "translateX(-50%)",
                background: ACCENT_GREEN,
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                borderRadius: 8,
                boxShadow: BOX_SHADOW,
                padding: "10px 28px",
              }}
            >
              Video exported successfully!
            </div>
          )}
        </div>

        {/* Timeline */}
        <div
          style={{
            height: 198,
            background: BG_TIMELINE,
            borderTop: "2px solid #212229",
            boxShadow: "0 -2px 18px #0004",
            paddingTop: 18,
            position: "relative",
          }}
        >
          {/* Video Track */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 18,
              paddingLeft: 69,
            }}
          >
            <span
              style={{
                width: 56,
                color: "#aab",
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: ".02em",
              }}
            >
              Video
            </span>
            <div
              style={{
                flex: 1,
                background: BG_DARK,
                borderRadius: 14,
                padding: "13px 22px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                minHeight: 58,
                overflowX: "auto",
              }}
            >
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="video-track" direction="horizontal">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{ display: "flex" }}
                    >
                      {selectedImages.length === 0 ? (
                        <span style={{ color: "#888", fontSize: 16 }}>
                          Drag images here to build video track
                        </span>
                      ) : (
                        selectedImages.map((img, idx) => (
                          <Draggable
                            draggableId={`video-${idx}`}
                            index={idx}
                            key={idx}
                          >
                            {(dragProps) => (
                              <div
                                ref={dragProps.innerRef}
                                {...dragProps.draggableProps}
                                {...dragProps.dragHandleProps}
                                style={{
                                  ...dragProps.draggableProps.style,
                                  width: 102,
                                  height: 60,
                                  borderRadius: 7,
                                  position: "relative",
                                  overflow: "hidden",
                                  border: "2px solid #283870",
                                  background: BG_ITEM,
                                  cursor: "grab",
                                  boxShadow: "0 1px 8px #0005",
                                  marginRight: 14,
                                }}
                              >
                                <img
                                  src={URL.createObjectURL(img)}
                                  alt=""
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                                <div
                                  style={{
                                    position: "absolute",
                                    bottom: 4,
                                    right: 9,
                                    background: ACCENT,
                                    color: "#fff",
                                    fontSize: 13,
                                    padding: "2px 10px",
                                    borderRadius: 13,
                                    fontWeight: 700,
                                    boxShadow: "0 1px 4px #0072",
                                  }}
                                >
                                  {idx + 1}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>
          {/* Audio Track */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 4,
              paddingLeft: 69,
            }}
          >
            <span
              style={{
                width: 56,
                color: "#aab",
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: ".02em",
              }}
            >
              Audio
            </span>
            <div
              style={{
                flex: 1,
                background: BG_DARK,
                borderRadius: 14,
                padding: "11px 22px",
                display: "flex",
                alignItems: "center",
                gap: 13,
                minHeight: 48,
              }}
            >
              {audioFile ? (
                <div
                  style={{
                    background: ACCENT_GREEN,
                    color: "#141518",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    borderRadius: 10,
                    padding: "10px 27px",
                    fontSize: 17,
                    boxShadow: "0 0 7px #0002",
                  }}
                >
                  {SvgAudio}
                  <span
                    style={{ color: "#222", fontWeight: 600, fontSize: 15 }}
                  >
                    {audioFile.name}
                  </span>
                  <button
                    onClick={removeAudio}
                    style={{
                      marginLeft: 19,
                      background: "#fff9",
                      color: "#181d16",
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: 15,
                      padding: 0,
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => timelineAudioInputRef.current.click()}
                    style={{
                      color: "#fff",
                      background: ACCENT_GREEN,
                      padding: "8px 22px",
                      borderRadius: 8,
                      border: "none",
                      fontWeight: 600,
                      fontSize: 16,
                      cursor: "pointer",
                      marginRight: 14,
                    }}
                  >
                    + Add audio
                  </button>
                  <input
                    ref={timelineAudioInputRef}
                    type="file"
                    accept="audio/*"
                    style={{ display: "none" }}
                    onChange={handleTimelineAudioImport}
                  />
                  <span style={{ color: "#777", fontSize: 16 }}>
                    No audio track
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoStitchingPage;
