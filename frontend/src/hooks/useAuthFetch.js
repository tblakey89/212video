import { useCallback } from "react";

export function useAuthFetch() {
  return useCallback(async (url, options = {}) => {
    return fetch(url, options);
  }, []);
}
