import { Project } from './Project.model';

export interface ProjectPaginated {
  projects: Array<Project>;
  pages: number;
  perPage: number;
  currentPage: number;
}
