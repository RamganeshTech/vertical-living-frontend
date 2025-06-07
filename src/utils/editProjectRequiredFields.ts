import type { ProjectInput } from "../components/CreateProject";
import type { IProject } from "../types/types";

export function mapProjectToProjectInput(project: IProject): ProjectInput {
  return {
    projectName: project.projectName,
    description: project.description ?? "",      // Handle null if needed
    duration: project.projectInformation.duration ?? 0,
    tags: project.projectInformation.tags ?? [],
    startDate: project.projectInformation.startDate
      ? new Date(project.projectInformation.startDate)
      : null,
    endDate: project.projectInformation.endDate
      ? new Date(project.projectInformation.endDate)
      : null,
    dueDate: project.projectInformation.dueDate
      ? new Date(project.projectInformation.dueDate)
      : null,
    priority: project.projectInformation.priority ?? "none",
    status: project.projectInformation.status ?? "Active",
  };
}
