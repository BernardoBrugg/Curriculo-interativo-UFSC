"use client";

import { useMemo } from "react";
import { Course } from "@/types/curriculum";

export function useCourseGraph(courses: Course[]) {
  return useMemo(() => {
    const courseMap = new Map<string, Course>();
    const dependentsMap = new Map<string, string[]>();

    courses.forEach((c) => {
      courseMap.set(c.id, c);
      if (!dependentsMap.has(c.id)) dependentsMap.set(c.id, []);
    });

    courses.forEach((c) => {
      c.prerequisites.forEach((pid) => {
        const deps = dependentsMap.get(pid);
        if (deps && !deps.includes(c.id)) deps.push(c.id);
      });
    });

    function getPrerequisites(id: string, visited = new Set<string>()): Set<string> {
      const course = courseMap.get(id);
      if (!course) return visited;
      course.prerequisites.forEach((pid) => {
        if (!visited.has(pid)) {
          visited.add(pid);
          getPrerequisites(pid, visited);
        }
      });
      return visited;
    }

    function getDependents(id: string, visited = new Set<string>()): Set<string> {
      const deps = dependentsMap.get(id) ?? [];
      deps.forEach((did) => {
        if (!visited.has(did)) {
          visited.add(did);
          getDependents(did, visited);
        }
      });
      return visited;
    }

    function getDirectPrereqs(id: string): Course[] {
      const course = courseMap.get(id);
      if (!course) return [];
      return course.prerequisites
        .map((pid) => courseMap.get(pid))
        .filter(Boolean) as Course[];
    }

    function getDirectDependents(id: string): Course[] {
      return (dependentsMap.get(id) ?? [])
        .map((did) => courseMap.get(did))
        .filter(Boolean) as Course[];
    }

    return {
      courseMap,
      dependentsMap,
      getPrerequisites,
      getDependents,
      getDirectPrereqs,
      getDirectDependents,
    };
  }, [courses]);
}
