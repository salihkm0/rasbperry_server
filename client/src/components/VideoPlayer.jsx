import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import axios from "axios";

function VideoPlayer() {
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const [isWifiConnected, setIsWifiConnected] = useState({
    status: "disconnected",
    message: "",
    ssid: "",
    password: "",
  });

  const checkWifiConnection = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/wifi-details"
      );
      setIsWifiConnected(response.data);
    } catch (error) {
      console.error("Error fetching Wi-Fi connection details:", error);
      setIsWifiConnected({ status: "disconnected", message: "" });
    }
  };

  // Fetch videos from the server
  const fetchVideos = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/videos-list");
      return response.data.videos;
    } catch (error) {
      console.error("Failed to load videos:", error);
      return [];
    }
  };

  // Compare video lists to see if there's any change
  const hasVideoListChanged = (newList, oldList) => {
    if (newList.length !== oldList.length) return true;
    return !newList.every((video, index) => video === oldList[index]);
  };

  useEffect(() => {
    checkWifiConnection();

    const wifiInterval = setInterval(() => {
      checkWifiConnection();
    }, 30000);

    return () => {
      clearInterval(wifiInterval);
    };
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchVideos().then((initialVideos) => setVideos(initialVideos));

    // Poll every minute to check for changes
    const interval = setInterval(async () => {
      const latestVideos = await fetchVideos();
      if (hasVideoListChanged(latestVideos, videos)) {
        console.log("Video list changed, restarting the video player.");
        setVideos(latestVideos);
        setCurrentVideoIndex(0);
      }
    }, 60000); // 60,000 ms = 1 minute

    return () => clearInterval(interval);
  }, [videos]);

  // Handle video end event to loop infinitely through videos
  const handleVideoEnd = () => {
    setCurrentVideoIndex(
      (prevIndex) => (prevIndex + 1) % videos.length // Move to next video or loop back to the first
    );
  };

  // Toggle mute state
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (playerContainerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        playerContainerRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div
      ref={playerContainerRef}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#000",
      }}
    >
      {videos.length > 0 ? (
        <ReactPlayer
          ref={playerRef}
          url={`http://localhost:3001/videos/${videos[currentVideoIndex]}`}
          playing={true}
          muted={isMuted}
          width="100%"
          height="100%"
          onEnded={handleVideoEnd}
        />
      ) : (
        <div style={{ width: "100%", height: "100vh", background: "#000" }}>
          <p style={{ color: "#fff", fontSize: "25px", fontWeight: "600" }}>
            Loading videos...
          </p>
        </div>
      )}
      <button
        onClick={toggleMute}
        style={{ position: "absolute", top: "10px", right: "10px" }}
      >
        {isMuted ? "Unmute" : "Mute"}
      </button>
      <button
        onClick={toggleFullscreen}
        style={{ position: "absolute", top: "10px", right: "70px" }}
      >
        Fullscreen
      </button>
    </div>
  );
}

export default VideoPlayer;

// import React, { useState, useEffect, useRef } from "react";
// import ReactPlayer from "react-player";
// import axios from "axios";

// function VideoPlayer() {
//   const [videos, setVideos] = useState([]);
//   const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
//   const [isMuted, setIsMuted] = useState(true);
//   const [isWifiConnected, setIsWifiConnected] = useState({
//     status: "disconnected",
//     message: "",
//     ssid: "",
//     password: "",
//   });
//   const playerRef = useRef(null);
//   const playerContainerRef = useRef(null);

//   // Fetch Wi-Fi connection status
//   const checkWifiConnection = async () => {
//     try {
//       const response = await axios.get(
//         "http://localhost:3001/api/wifi-details"
//       ); // Adjust the URL as needed
//       console.log("Checking Wi-Fi connection status:", response.data.status);
//       if (response.data.status === "connected") {
//         setIsWifiConnected(response.data);
//       } else {
//         setIsWifiConnected(response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching Wi-Fi connection details:", error);
//       setIsWifiConnected(false);
//     }
//   };

//   // Fetch videos from the server
//   const fetchVideos = async () => {
//     try {
//       const response = await axios.get("http://localhost:3001/api/videos-list");
//       return response.data.videos;
//     } catch (error) {
//       console.error("Failed to load videos:", error);
//       return [];
//     }
//   };

//   // Compare video lists to see if there's any change
//   const hasVideoListChanged = (newList, oldList) => {
//     if (newList.length !== oldList.length) return true;
//     return !newList.every((video, index) => video === oldList[index]);
//   };

//   useEffect(() => {
//     // Initial Wi-Fi check
//     checkWifiConnection();

//     // Initial fetch for videos
//     fetchVideos().then((initialVideos) => setVideos(initialVideos));

//     // Poll every minute to check for changes in video list and Wi-Fi connection
//     const interval = setInterval(async () => {
//       const latestVideos = await fetchVideos();
// checkWifiConnection(); // Re-check Wi-Fi connection every minute

//       if (hasVideoListChanged(latestVideos, videos)) {
//         console.log("Video list changed, restarting the video player.");
//         setVideos(latestVideos);
//         setCurrentVideoIndex(0);
//       }
//     }, 60000); // 60,000 ms = 1 minute

//     return () => clearInterval(interval);
//   }, [videos]);

//   // Handle video end event to loop infinitely through videos
//   const handleVideoEnd = () => {
//     setCurrentVideoIndex(
//       (prevIndex) => (prevIndex + 1) % videos.length // Move to next video or loop back to the first
//     );
//   };

//   // Toggle mute state
//   const toggleMute = () => {
//     setIsMuted(!isMuted);
//   };

//   // Toggle fullscreen mode
//   const toggleFullscreen = () => {
//     if (playerContainerRef.current) {
//       if (document.fullscreenElement) {
//         document.exitFullscreen();
//       } else {
//         playerContainerRef.current.requestFullscreen();
//       }
//     }
//   };

//   return (
//     <div
//       ref={playerContainerRef}
//       style={{
//         width: "100vw",
//         height: "100vh",
//         overflow: "hidden",
//         position: "relative",
//         backgroundColor: "#000",
//       }}
//     >
//       {videos.length > 0 ? (
//         <ReactPlayer
//           ref={playerRef}
//           url={`http://localhost:3001/videos/${videos[currentVideoIndex]}`}
//           playing={true}
//           muted={isMuted}
//           width="100%"
//           height="100%"
//           onEnded={handleVideoEnd}
//         />
//       ) : (
//         <div style={{ width: "100%", height: "100vh", background: "#000" }}>
//           <p style={{ color: "#fff", fontSize: "25px", fontWeight: "600" }}>
//             Loading videos...
//           </p>
//         </div>
//       )}
//       <button
//         onClick={toggleMute}
//         style={{ position: "absolute", top: "10px", right: "10px" }}
//       >
//         {isMuted ? "Unmute" : "Mute"}
//       </button>
//       <button
//         onClick={toggleFullscreen}
//         style={{ position: "absolute", top: "10px", right: "70px" }}
//       >
//         Fullscreen
//       </button>

//       {/* Popup for Wi-Fi disconnected status */}
//       {isWifiConnected.status === "disconnected" && (
//         <div
//           style={{
//             position: "fixed",
//             top: "20px",
//             left: 0,
//             width: "100vw",
//             height: "100vh",
//             // backgroundColor: "rgba(0, 0, 0, 0)",
//             color: "#ff0000",
//             zIndex: 1000,
//             fontSize: "14px",
//             fontWeight: "bold",
//             textAlign: "center",
//             padding: "20px",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "end",
//             justifyContent: "start",
//           }}
//         >
//           <p> Wi-Fi Not Connected </p>
//           <p style={{ fontSize: "10px", fontWeight: "" }}>
//             Please connect
//             <span style={{ color: "#f1bf19" }}>{isWifiConnected.ssid}</span> to
//             <span style={{ color: "#f1bf19" }}>{isWifiConnected.password}</span>
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default VideoPlayer;

// import React, { useState, useEffect, useRef } from "react";
// import ReactPlayer from "react-player";
// import axios from "axios";

// function VideoPlayer() {
//   const [videos, setVideos] = useState([]);
//   const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
//   const [isMuted, setIsMuted] = useState(true);
//   const [isWifiConnected, setIsWifiConnected] = useState({
//     status: "disconnected",
//     message: "",
//     ssid: "",
//     password: "",
//   });
//   const playerRef = useRef(null);
//   const playerContainerRef = useRef(null);

//   // Fetch Wi-Fi connection status
//   const checkWifiConnection = async () => {
//     try {
//       const response = await axios.get("http://localhost:3001/api/wifi-details");
//       setIsWifiConnected(response.data);
//     } catch (error) {
//       console.error("Error fetching Wi-Fi connection details:", error);
//       setIsWifiConnected({ status: "disconnected", message: "" });
//     }
//   };

//   // Fetch videos from the server
//   const fetchVideos = async () => {
//     try {
//       const response = await axios.get("http://localhost:3001/api/videos-list");
//       return response.data.videos;
//     } catch (error) {
//       console.error("Failed to load videos:", error);
//       return [];
//     }
//   };

//   // Compare video lists to detect changes
//   const hasVideoListChanged = (newList, oldList) => {
//     if (newList.length !== oldList.length) return true;
//     return !newList.every((video, index) => video === oldList[index]);
//   };

//   useEffect(() => {
//     // Initial fetch
//     checkWifiConnection();
//     fetchVideos().then((initialVideos) => setVideos(initialVideos));

//     // Poll for Wi-Fi status every 30 seconds
//     const wifiInterval = setInterval(() => {
//       checkWifiConnection();
//     }, 30000); // 30,000 ms = 30 seconds

//     // Poll for video list updates every 5 minutes
//     const videoInterval = setInterval(async () => {
//       const latestVideos = await fetchVideos();
//       if (hasVideoListChanged(latestVideos, videos)) {
//         console.log("Video list changed, updating the video list.");
//         setVideos(latestVideos);
//       }
//     }, 300000); // 300,000 ms = 5 minutes

//     return () => {
//       clearInterval(wifiInterval);
//       clearInterval(videoInterval);
//     };
//   }, [videos]);

//   // Handle video end event to loop through videos
//   const handleVideoEnd = () => {
//     setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
//   };

//   // Toggle mute state
//   const toggleMute = () => {
//     setIsMuted(!isMuted);
//   };

//   // Toggle fullscreen mode
//   const toggleFullscreen = () => {
//     if (playerContainerRef.current) {
//       if (document.fullscreenElement) {
//         document.exitFullscreen();
//       } else {
//         playerContainerRef.current.requestFullscreen();
//       }
//     }
//   };

//   return (
//     <div
//       ref={playerContainerRef}
//       style={{
//         width: "100vw",
//         height: "100vh",
//         overflow: "hidden",
//         position: "relative",
//         backgroundColor: "#000",
//       }}
//     >
//       {videos.length > 0 ? (
//         <ReactPlayer
//           ref={playerRef}
//           url={`http://localhost:3001/videos/${videos[currentVideoIndex]}`}
//           playing={true}
//           muted={isMuted}
//           width="100%"
//           height="100%"
//           onEnded={handleVideoEnd}
//         />
//       ) : (
//         <div style={{ width: "100%", height: "100vh", background: "#000" }}>
//           <p style={{ color: "#fff", fontSize: "25px", fontWeight: "600" }}>
//             Loading videos...
//           </p>
//         </div>
//       )}
//       <button
//         onClick={toggleMute}
//         style={{ position: "absolute", top: "10px", right: "10px" }}
//       >
//         {isMuted ? "Unmute" : "Mute"}
//       </button>
//       <button
//         onClick={toggleFullscreen}
//         style={{ position: "absolute", top: "10px", right: "70px" }}
//       >
//         Fullscreen
//       </button>

//       {/* Wi-Fi disconnected status popup */}
//       {isWifiConnected.status === "disconnected" && (
//         <div
//           style={{
//             position: "fixed",
//             top: "20px",
//             left: 0,
//             width: "auto",
//             height: "70px",
//             color: "#ff0000",
//             zIndex: 1000,
//             fontSize: "14px",
//             fontWeight: "bold",
//             textAlign: "center",
//             padding: "20px",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "start",
//             justifyContent: "start",
//           }}
//         >
//           <p> Wi-Fi Not Connected </p>
//           <p style={{ fontSize: "10px" }}>
//             Please connect to
//             <span style={{ color: "#f1bf19" }}> {isWifiConnected.ssid}</span>
//             with password
//             <span style={{ color: "#f1bf19" }}> {isWifiConnected.password}</span>.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default VideoPlayer;
