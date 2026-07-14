interface PopoverAnchorRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface PopoverViewport {
  width: number;
  height: number;
}

interface PopoverPositionOptions {
  width?: number;
  height?: number;
  gap?: number;
  margin?: number;
}

export function getCoursePopoverPosition(
  rect: PopoverAnchorRect,
  viewport: PopoverViewport,
  options: PopoverPositionOptions = {}
) {
  const width = options.width ?? 288;
  const height = options.height ?? 240;
  const gap = options.gap ?? 12;
  const margin = options.margin ?? 16;
  const rightPosition = rect.right + gap;
  const leftPosition = rect.left - width - gap;
  const left = rightPosition + width + margin <= viewport.width ? rightPosition : Math.max(margin, leftPosition);
  const top = Math.min(Math.max(margin, rect.top), Math.max(margin, viewport.height - height - margin));

  return { left, top };
}
