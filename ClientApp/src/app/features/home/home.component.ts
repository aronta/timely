import { Component, OnInit } from '@angular/core';
import { Project, ProjectService } from 'src/app/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  constructor(public projectService: ProjectService) {}

  projects: Project[] = [];
  showModal: boolean = false;

  ngOnInit() {
    this.projectService
      .getAllProjects$()
      .subscribe((res) => (this.projects = res));
  }

  startTimer() {
    this.projectService.startTimer$().subscribe();
    this.projectService
      .getAllProjects$()
      .subscribe((res) => (this.projects = res));
  }

  stopTimer() {
    this.showModal = !this.showModal;
  }

  getProjectDuration(index: number) {
    const project = this.projects[index];
    const start = new Date(project.start_time);

    if (project.end_time && project.end_time !== null) {
      const end = new Date(project.end_time);
      return end.valueOf() - start.valueOf();
    }

    return '';
  }
}
