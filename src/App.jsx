// src/App.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import StoryPage from "./pages/StoryPage";
import CharacterPage from "./pages/CharacterPage";
import BackgroundPage from "./pages/BackgroundPage";
import ScenePage from "./pages/ScenePage";
import PreviewPage from "./pages/PreviewPage";
import { checkApiStatus } from "./services/api";

const App = () => {
  const [activeTab, setActiveTab] = useState("story");
  const [apiStatus, setApiStatus] = useState("checking");
  const [currentProject, setCurrentProject] = useState({
    title: "Untitled Project",
    story: null,
    characters: [],
    backgrounds: [],
    scenes: [],
  });

  useEffect(() => {
    const checkApi = async () => {
      try {
        await checkApiStatus();
        setApiStatus("connected");
      } catch (error) {
        setApiStatus("error");
      }
    };

    checkApi();

    // Load saved project data
    const savedProject = localStorage.getItem("currentProject");
    if (savedProject) {
      setCurrentProject(JSON.parse(savedProject));
    }
  }, []);

  const saveProject = () => {
    localStorage.setItem("currentProject", JSON.stringify(currentProject));
    alert("Project saved successfully!");
  };

  const newProject = () => {
    const newProj = {
      title: "Untitled Project",
      story: null,
      characters: [],
      backgrounds: [],
      scenes: [],
    };
    setCurrentProject(newProj);
    localStorage.setItem("currentProject", JSON.stringify(newProj));
    setActiveTab("story");
  };

  return (
    <Router>
      <div className="app">
        <Header
          apiStatus={apiStatus}
          onNewProject={newProject}
          onSaveProject={saveProject}
        />

        <div className="app-layout">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currentProject={currentProject}
            setCurrentProject={setCurrentProject}
          />

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/story" replace />} />
              <Route
                path="/story"
                element={
                  <StoryPage
                    currentProject={currentProject}
                    setCurrentProject={setCurrentProject}
                  />
                }
              />
              <Route
                path="/characters"
                element={
                  <CharacterPage
                    currentProject={currentProject}
                    setCurrentProject={setCurrentProject}
                  />
                }
              />
              <Route
                path="/backgrounds"
                element={
                  <BackgroundPage
                    currentProject={currentProject}
                    setCurrentProject={setCurrentProject}
                  />
                }
              />
              <Route
                path="/scenes"
                element={
                  <ScenePage
                    currentProject={currentProject}
                    setCurrentProject={setCurrentProject}
                  />
                }
              />
              <Route
                path="/preview"
                element={
                  <PreviewPage
                    currentProject={currentProject}
                    setCurrentProject={setCurrentProject}
                  />
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;