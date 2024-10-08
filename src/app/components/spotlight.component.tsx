"use client";
import type { IContainerSize, IMousePosition, SpotlightCardProps, SpotlightProps } from "../types";
import React, { useRef, useState, useEffect } from "react";
import useMousePosition from "../utility/mouse";

export default function Spotlight({ children, className = "" }: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition();
  const mouse = useRef<IMousePosition>({ x: 0, y: 0 });
  const containerSize = useRef<IContainerSize>({ w: 0, h: 0 });
  const [boxes, setBoxes] = useState<Array<HTMLElement>>([]);

  const initContainer = () => {
    if (containerRef.current) {
      containerSize.current.w = containerRef.current.offsetWidth;
      containerSize.current.h = containerRef.current.offsetHeight;
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      setBoxes(Array.from(containerRef.current.children).map((el) => el as HTMLElement));
    }
  }, []);

  useEffect(() => {
    initContainer();
    window.addEventListener("resize", initContainer);

    return () => {
      window.removeEventListener("resize", initContainer);
    };
  }, [setBoxes]);

  useEffect(() => {
    const onMouseMove = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const { w, h } = containerSize.current;
        const x = mousePosition.x - rect.left;
        const y = mousePosition.y - rect.top;
        const inside = x < w && x > 0 && y < h && y > 0;
        if (inside) {
          mouse.current.x = x;
          mouse.current.y = y;
          boxes.forEach((box) => {
            const boxX = -(box.getBoundingClientRect().left - rect.left) + mouse.current.x;
            const boxY = -(box.getBoundingClientRect().top - rect.top) + mouse.current.y;
            box.style.setProperty("--mouse-x", `${boxX}px`);
            box.style.setProperty("--mouse-y", `${boxY}px`);
          });
        }
      }
    };
    onMouseMove();
  }, [boxes, mousePosition]);

  return (
    <div className={className} ref={containerRef}>
      {children}
    </div>
  );
}

export function SpotlightCard({ children, className = "" }: SpotlightCardProps) {
  return (
    <div
      className={`relative h-full bg-slate-800 rounded-3xl p-px before:absolute before:w-80 before:h-80 before:-left-40 before:-top-40 before:bg-slate-400 before:rounded-full before:opacity-0 before:pointer-events-none before:transition-opacity before:duration-500 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:group-hover:opacity-100 before:z-10 before:blur-[100px] after:absolute after:w-96 after:h-96 after:-left-48 after:-top-48 after:bg-indigo-500 after:rounded-full after:opacity-0 after:pointer-events-none after:transition-opacity after:duration-500 after:translate-x-[var(--mouse-x)] after:translate-y-[var(--mouse-y)] after:hover:opacity-10 after:z-30 after:blur-[100px] overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}
