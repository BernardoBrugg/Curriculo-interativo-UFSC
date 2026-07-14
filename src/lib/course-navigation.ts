export async function addCourseAndNavigate(
  addCourse: (courseId: string) => Promise<void>,
  navigate: (href: string) => void,
  courseId: string
) {
  await addCourse(courseId);
  navigate(`/${courseId}`);
}
