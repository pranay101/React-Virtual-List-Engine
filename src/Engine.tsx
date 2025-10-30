"use client";

import React, { useRef, useState, useEffect, CSSProperties } from "react";

export interface VirtualEngineProps<T> {
  /** Total number of items */
  itemCount: number;

  /** Height of each item (fixed height for now) */
  itemHeight: number;

  /** Height of the scrollable container */
  height: number;

  /** Width of the list */
  width?: number | string;

  /** Optional overscan count for smoother scrolling */
  overscan?: number;

  /** Function to render each item */
  renderItem: (props: {
    index: number;
    style: CSSProperties;
    data?: T;
  }) => React.ReactNode;

  /** Optional data array (passed into renderItem) */
  data?: T[];
}

export function VirtualListEngine<T>({
  itemCount,
  itemHeight,
  height,
  width = "100%",
  overscan = 3,
  renderItem,
  data,
}: VirtualEngineProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = itemCount * itemHeight;

  // Calculate visible range
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    itemCount - 1,
    Math.floor((scrollTop + height) / itemHeight) + overscan,
  );

  // Build visible items
  const visibleItems: React.ReactNode[] = [];
  for (let i = startIndex; i <= endIndex; i++) {
    const style: CSSProperties = {
      position: "absolute",
      top: i * itemHeight,
      height: itemHeight,
      width: "100%",
    };

    visibleItems.push(
      renderItem({
        index: i,
        style,
        data: data ? data[i] : undefined,
      }),
    );
  }

  // Scroll handler
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  console.log(visibleItems);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        overflowY: "auto",
        height,
        width,
        border: "1px solid #ccc",
      }}
    >
      <div style={{ position: "relative", height: totalHeight }}>
        {visibleItems}
      </div>
    </div>
  );
}

export default VirtualListEngine;
