// src/App.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StoryPage from "./pages/StoryPage";
import CharacterPage from "./pages/CharacterPage";
import BackgroundPage from "./pages/BackgroundPage";
import ScenePage from "./pages/ScenePage";
import PreviewPage from "./pages/PreviewPage";
import HomePage from "./pages/HomePage";
import {
  getProjects,
  createProject as createProjectApi,
  setAuthHeader,
} from "./services/api";

function App() {
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState(
    localStorage.getItem("userApiKey") || ""
  );
  const [hasLoadError, setHasLoadError] = useState(false); // New state to track loading errors
  const navigate = useNavigate();

  // Set the API key in the API service when it changes
  useEffect(() => {
    setAuthHeader(apiKey);
    localStorage.setItem("userApiKey", apiKey);
  }, [apiKey]);

  // Load projects from local storage or API on initial render
  useEffect(() => {
    const fetchProjects = async () => {
      if (!apiKey) {
        console.warn(
          "API key is not set. Please enter your key in the sidebar."
        );
        // If there's no key, we can't fetch. Display a user-friendly message.
        setHasLoadError(true);
        return;
      }
      try {
        const response = await getProjects();
        setProjects(response.data);
        if (response.data.length > 0) {
          setCurrentProject(response.data[0]);
        } else {
          handleCreateProject("New Project");
        }
        setHasLoadError(false); // Clear any previous error on success
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setHasLoadError(true); // Set error state on failure
      }
    };
    fetchProjects();
  }, [apiKey]);

  const handleSelectProject = (projectId) => {
    const selectedProject = projects.find((p) => p.id === projectId);
    if (selectedProject) {
      setCurrentProject(selectedProject);
      navigate("/story");
    }
  };

  const handleCreateProject = async (name) => {
    try {
      const response = await createProjectApi({ name });
      const newProject = response.data;
      setProjects([...projects, newProject]);
      setCurrentProject(newProject);
      navigate("/story");
    } catch (error) {
      console.error("Failed to create new project:", error);
    }
  };

  const updateProjectInList = (updatedProject) => {
    setProjects(
      projects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
    setCurrentProject(updatedProject);
  };

  const handleSetApiKey = (key) => {
    setApiKey(key);
  };

  // Conditional rendering based on loading and error states
  if (hasLoadError) {
    return (
      <div className="app-load-message">
        <p>
          Failed to load projects. Please check your API key and ensure the
          backend is running.
        </p>
        <p>
          If you're using a hosted service, check its status. If you're running
          locally, ensure your server is active.
        </p>
      </div>
    );
  }

  if (!currentProject) {
    return <div className="app-load-message">Loading...</div>;
  }

  return (
    <div className="app">
      <Header currentProject={currentProject} />
      <div className="app-layout">
        <Sidebar
          projects={projects}
          currentProjectId={currentProject.id}
          onSelectProject={handleSelectProject}
          onCreateProject={handleCreateProject}
          apiKey={apiKey}
          onSetApiKey={handleSetApiKey}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/story"
              element={
                <StoryPage
                  currentProject={currentProject}
                  setCurrentProject={updateProjectInList}
                  isGenerating={isGenerating}
                  setIsGenerating={setIsGenerating}
                />
              }
            />
            <Route
              path="/characters"
              element={
                <CharacterPage
                  currentProject={currentProject}
                  setCurrentProject={updateProjectInList}
                  isGenerating={isGenerating}
                  setIsGenerating={setIsGenerating}
                />
              }
            />
            <Route
              path="/backgrounds"
              element={
                <BackgroundPage
                  currentProject={currentProject}
                  setCurrentProject={updateProjectInList}
                  isGenerating={isGenerating}
                  setIsGenerating={setIsGenerating}
                />
              }
            />
            <Route
              path="/scenes"
              element={
                <ScenePage
                  currentProject={currentProject}
                  setCurrentProject={updateProjectInList}
                  isGenerating={isGenerating}
                  setIsGenerating={setIsGenerating}
                />
              }
            />
            <Route path="/preview" element={<PreviewPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
