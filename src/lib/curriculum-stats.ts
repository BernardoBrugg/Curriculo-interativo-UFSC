export function sumCourseCredits(courses: Array<{ credits: number }>) {
  return courses.reduce((total, course) => total + course.credits, 0);
}
