// import open from "open";

// export default async function openBrowser() {
//   try {
//     await open('http://localhost:5173/', { app: { name: 'google chrome', arguments: ["--start-fullscreen"] } });
//     console.log("✔ Browser opened in fullscreen mode");
//   } catch (error) {
//     console.error("✖ Failed to open browser:", error);
//   }
// }


// import open from "open";

// export default async function openBrowser() {
//   try {
//     await open('http://localhost:5173/', { app: { name: 'firefox', arguments: ["--kiosk"] } });
//     console.log("✔ Browser opened in kiosk (fullscreen) mode");
//   } catch (error) {
//     console.error("✖ Failed to open browser:", error);
//   }
// }

import { exec } from "child_process";

export default async function openBrowser() {
  exec("chromium-browser --kiosk --start-fullscreen --noerrdialogs --disable-infobars --hide-scrollbar http://localhost:5173/", (error) => {
    if (error) {
      console.error("✖ Failed to open Chromium in kiosk mode:", error);
    } else {
      console.log("✔ Chromium opened in fullscreen kiosk mode");
    }
  });
}
