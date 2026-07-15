export function shouldStartDragScroll(target: EventTarget | null) {
  if (!target || !("closest" in target) || typeof target.closest !== "function") return true;
  return !target.closest("button, a, input, textarea, select, [data-drag-handle]");
}
