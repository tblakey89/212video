import { useEffect, useState } from "react";

export function useYouTubeApiReady() {
  const [apiReady, setApiReady] = useState(false);

  useEffect(() => {
    const scriptId = "youtube-iframe-api";
    if (window.YT && window.YT.Player) {
      setApiReady(true);
      return;
    }

    if (document.getElementById(scriptId)) {
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "/iframe_api.js";
    script.onerror = () => {
      console.error("Failed to load /iframe_api.js. Place a cached copy in frontend/public.");
    };
    document.body.appendChild(script);

    window.onYouTubeIframeAPIReady = () => {
      setApiReady(true);
    };
  }, []);

  return apiReady;
}
