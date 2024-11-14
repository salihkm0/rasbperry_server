import open from "open";

export default async function openBrowser() {
  try {
    await open('http://localhost:5173/', { app: { name: 'google chrome', arguments: ["--start-fullscreen"] } });
    console.log("✔ Browser opened in fullscreen mode");
  } catch (error) {
    console.error("✖ Failed to open browser:", error);
  }
}
