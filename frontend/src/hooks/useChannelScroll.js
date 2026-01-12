import { useEffect, useRef, useState } from "react";

export function useChannelScroll({ view, selectedChannel, filter, pageSize }) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (view !== "channel") {
      return;
    }
    setVisibleCount(pageSize);
  }, [view, selectedChannel, filter, pageSize]);

  useEffect(() => {
    if (view !== "channel" || !selectedChannel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setVisibleCount((prev) => prev + pageSize);
        }
      },
      { rootMargin: "200px" }
    );

    const node = sentinelRef.current;
    if (node) {
      observer.observe(node);
    }

    return () => {
      observer.disconnect();
    };
  }, [view, selectedChannel, pageSize]);

  return { visibleCount, sentinelRef };
}
