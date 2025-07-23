import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import TraineeAccess from "./pages/TraineeAccess";
import VideoView from "./pages/VideoView";
import Narration from "./pages/Narration";
import NarrationDemo from "./pages/NarrationDemo";
import VideoGenerator from "./pages/VideoGenerator";
import Login from "./pages/Login"; // ✅ Add this page
import Signup from "./pages/Signup";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home page is now the landing page */}
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
        

        {/* Authenticated user routes */}
        <Route path="/home" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="upload" element={<Upload />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="presentation/:id" element={<VideoView />} />
          <Route path="narration" element={<Narration />} />
          <Route path="narration-demo" element={<NarrationDemo />} />
          <Route path="video-generator" element={<VideoGenerator narrationText="Hello, welcome to the training." />} />
        </Route>

        {/* Trainee-only route */}
        <Route path="/trainee" element={<TraineeAccess />} />
      </Routes>
    </BrowserRouter>
  );
}
