export interface ProjectType {
  projectName: string | null,
  description: string | null,
  duration: number | null,
  tags: string[],
  startDate: Date | null,
  endDate: Date | null,
  dueDate: Date | null,
  priority: string,
  status: string,
}