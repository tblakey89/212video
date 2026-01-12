import { useEffect, useRef, useState } from "react";

export function useInfiniteScroll({ itemsLength, pageSize }) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const sentinelRef = useRef(null);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [itemsLength, pageSize]);

  useEffect(() => {
    if (!sentinelRef.current) {
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
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [itemsLength, pageSize]);

  return { visibleCount, sentinelRef };
}
