import React, { useEffect } from "react";
import VideoPlayer from "./components/VideoPlayer";

function App() {
  useEffect(() => {
    const enterFullscreen = () => {
      const docElm = document.documentElement;
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      }
    };
    enterFullscreen();
  }, []);

  return (
    <div>
      <VideoPlayer />
    </div>
  );
}

export default App;
