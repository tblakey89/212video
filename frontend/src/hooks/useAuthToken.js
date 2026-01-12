import { useEffect, useState } from "react";

export function useAuthToken() {
  const [authToken, setAuthToken] = useState(() => sessionStorage.getItem("authToken") || "");

  useEffect(() => {
    if (authToken) {
      sessionStorage.setItem("authToken", authToken);
    } else {
      sessionStorage.removeItem("authToken");
    }
  }, [authToken]);

  return [authToken, setAuthToken];
}
