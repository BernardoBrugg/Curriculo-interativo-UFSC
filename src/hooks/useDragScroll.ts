"use client";

import { useRef, useState, useEffect, MouseEvent, WheelEvent } from "react";
import { shouldStartDragScroll } from "@/lib/drag-scroll";

function hasVerticalScrollableAncestor(target: EventTarget | null, root: HTMLElement): boolean {
  let element = target as HTMLElement | null;
  while (element && element !== root) {
    if (element.scrollHeight > element.clientHeight) {
      const overflowY = window.getComputedStyle(element).overflowY;
      if (overflowY === "auto" || overflowY === "scroll") {
        return true;
      }
    }
    element = element.parentElement;
  }
  return false;
}

export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isPointerDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const onMouseDown = (event: MouseEvent<T>) => {
    if (event.button !== 0 || !ref.current) return;
    if (!shouldStartDragScroll(event.target)) return;
    isPointerDownRef.current = true;
    startXRef.current = event.pageX;
    scrollLeftRef.current = ref.current.scrollLeft;
  };

  const onMouseMove = (event: MouseEvent<T>) => {
    if (!isPointerDownRef.current || !ref.current) return;
    const distance = Math.abs(event.pageX - startXRef.current);
    if (!isDragging) {
      if (distance < 6) return;
      setIsDragging(true);
    }
    event.preventDefault();
    const walk = event.pageX - startXRef.current;
    ref.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const onMouseUp = () => {
    isPointerDownRef.current = false;
    setIsDragging(false);
  };

  const onMouseLeave = () => {
    isPointerDownRef.current = false;
    setIsDragging(false);
  };

  const onWheel = (event: WheelEvent<T>) => {
    if (!ref.current) return;
    if (Math.abs(event.deltaY) > 0 && Math.abs(event.deltaX) === 0) {
      if (hasVerticalScrollableAncestor(event.target, ref.current)) {
        return;
      }
      ref.current.scrollLeft += event.deltaY;
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isPointerDownRef.current) {
        isPointerDownRef.current = false;
        setIsDragging(false);
      }
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  return {
    ref,
    isDragging,
    events: {
      onMouseDown,
      onMouseLeave,
      onMouseUp,
      onMouseMove,
      onWheel,
    },
  };
}
