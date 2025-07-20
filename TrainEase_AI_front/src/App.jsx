import { BrowserRouter, Routes, Route } from "react-router-dom";



import Home from "./pages/home";
import Layout from "./components/layout";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import TraineeAccess from "./pages/TraineeAccess";
import VideoView from "./pages/VideoView";
import Narration from "./pages/Narration";
import NarrationDemo from "./pages/NarrationDemo";
import VideoGenerator from "./pages/VideoGenerator";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="upload" element={<Upload />} />
          <Route path="dashboard" element={<Dashboard/>} />
          <Route path="/trainee" element={<TraineeAccess />} />
          <Route path="/presentation/:id" element={<VideoView />} />
           <Route path="/narration" element={<Narration />} />
           <Route path="/narration-demo" element={<NarrationDemo />} />
           <Route path="/video-generator" element={<VideoGenerator narrationText="Hello, welcome to the training." />} />

          {/* Add more routes as needed */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
