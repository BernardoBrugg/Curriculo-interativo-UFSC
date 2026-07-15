export function toggleCourseRemovalConfirmation(currentCourseId: string | null, courseId: string) {
  return currentCourseId === courseId ? null : courseId;
}
