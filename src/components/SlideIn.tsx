"use client";
import React, { ReactNode, useEffect, useRef } from "react";

type Props = {
  children: ReactNode;
  duration?: number;
  delay?: number;
};

export function SlideIn({ children, duration = 0.6, delay = 0 }: Props) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.style.animation = `slide-in ${duration}s ease ${delay}s forwards`;
          observer.unobserve(element);
        }
      },
      {
        threshold: 0,
        rootMargin: "-150px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay, duration]);

  return (
    <div ref={elementRef} className="slide-in-hidden">
      {children}
    </div>
  );
}
