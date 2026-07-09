export function getEditorPageInfo(pathname, tab) {
  if (pathname === "/editor")
    return {
      title: "Dashboard",
      description: "Manage your content workspace",
    };

  if (pathname === "/editor/courses")
    return {
      title: "Manage Courses",
      description: "Manage learning courses",
    };

  if (pathname === "/editor/courses/new")
    return {
      title: "Add Course",
      description: "Create a new course",
    };

  if (pathname === "/editor/curriculum") {
    if (tab === "topics")
      return {
        title: "Topics",
        description: "Manage course topics",
      };

    if (tab === "subtopics")
      return {
        title: "SubTopics",
        description: "Manage topic sub-sections",
      };

    return {
      title: "Curriculum",
      description: "Manage curriculum",
    };
  }

  if (pathname.startsWith("/editor/modules/text"))
    return {
      title: "Text Modules",
      description: "Manage text lessons",
    };

  if (pathname.startsWith("/editor/modules/video"))
    return {
      title: "Video Modules",
      description: "Manage video lessons",
    };

  if (pathname.startsWith("/editor/modules/audio"))
    return {
      title: "Audio Modules",
      description: "Manage audio lessons",
    };

  if (pathname.startsWith("/editor/modules/vocabulary"))
    return {
      title: "Vocabulary Modules",
      description: "Manage vocabulary",
    };

  if (
    pathname.startsWith("/editor/modules/exercise") &&
    pathname.includes("/questions")
  )
    return {
      title: "Questions",
      description: "Manage exercise questions",
    };

  if (pathname.startsWith("/editor/modules/exercise"))
    return {
      title: "Exercise Modules",
      description: "Manage exercise modules",
    };

  return {
    title: "Editor",
    description: "Content management",
  };
}