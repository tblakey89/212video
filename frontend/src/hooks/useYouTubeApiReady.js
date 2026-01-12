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
    script.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(script);

    window.onYouTubeIframeAPIReady = () => {
      setApiReady(true);
    };
  }, []);

  return apiReady;
}
