import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, timer } from 'rxjs';
import { Project, ProjectService } from 'src/app/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  @ViewChild('modal', { static: true }) modalRef?: NgbModalRef;
  constructor(
    public projectService: ProjectService,
    private modalService: NgbModal
  ) {}

  //TODO: return sve projekte sortiranje po vremenu stvaranja
  //TODO: vidit izbacivanje jsona u excel tjst csv. format
  //TODO: remove all
  //TODO: timer

  projects: Project[] = [];
  project_name: string = '';
  closeResult: string = '';
  editingIndex?: number;
  editingFlag: boolean = false;

  ngOnInit() {
    this.projectService.getAllProjects$().subscribe((res) => {
      this.projects = res;
    });
  }

  activeProjectExists() {
    var activeProjectIndex: number;
    activeProjectIndex = this.projects.findIndex(
      (item) => item.end_time === null
    );

    if (activeProjectIndex !== -1) {
      return true;
    }

    return false;
  }

  startTimer() {
    this.projectService.startTimer$().subscribe((_) => {
      this.projectService.getAllProjects$().subscribe((res) => {
        this.projects = res;
      });
    });
  }

  stopTimer(modal: any) {
    this.modalService.open(modal);
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

  saveStoppedProject(modal: NgbModalRef) {
    if (!this.editingFlag) {
      this.projectService.stopTimer$(this.project_name).subscribe((_) => {
        this.project_name = '';
        modal.close();
        this.projectService
          .getAllProjects$()
          .subscribe((res) => (this.projects = res));
      });
    } else {
      if (this.editingIndex !== undefined) {
        this.projectService
          .edit$(this.editingIndex, this.project_name)
          .subscribe((_) => {
            this.project_name = '';
            modal.close();
            this.editingFlag = false;
            this.editingIndex = undefined;
            this.projectService
              .getAllProjects$()
              .subscribe((res) => (this.projects = res));
          });
      }
    }
  }

  editProject(index: number, modal: any) {
    const project = this.projects[index];
    if (project.name) {
      this.editingFlag = true;
      this.editingIndex = project.id;
      this.project_name = project.name;
      this.modalService.open(modal);
    }
  }

  removeProject(index: number) {
    this.projectService.delete$(this.projects[index].id).subscribe((_) => {
      this.projectService
        .getAllProjects$()
        .subscribe((res) => (this.projects = res));
    });
  }
}
