import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Project, ProjectService } from 'src/app/core';

const DURATION_KEY = 'duration';
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

  projects: Project[] = [];
  project_name: string = '';
  closeResult: string = '';
  editingIndex?: number;
  editingFlag: boolean = false;
  time: number = 0;
  interval: ReturnType<typeof setInterval> | undefined;

  ngOnInit() {
    this.projectService.getAllProjects$().subscribe((res) => {
      this.projects = res;

      var counterFromSession = window.sessionStorage.getItem(DURATION_KEY);

      if (counterFromSession !== null) {
        if (this.activeProjectExists()) {
          if (this.interval !== undefined) clearInterval(this.interval);
          this.time = parseInt(counterFromSession);
          this.startDuration();
        }
      }
    });
  }

  // Helper function for formatting live timer
  timerFormat() {
    var d = new Date(0, 0, 0, 0, 0, 0, 0);
    d.setSeconds(this.time);
    return d;
  }

  startDuration() {
    this.interval = setInterval(() => {
      this.time++;
      if (this.time > 0) {
        window.sessionStorage.setItem(DURATION_KEY, String(this.time));
      } else {
        window.sessionStorage.removeItem(DURATION_KEY);
        if (this.interval !== undefined) clearInterval(this.interval);
      }
    }, 1000);
  }

  clearTimerInterval() {
    window.sessionStorage.removeItem(DURATION_KEY);
    if (this.interval !== undefined) clearInterval(this.interval);
    this.time = 0;
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
      this.startDuration();
      this.projectService.getAllProjects$().subscribe((res) => {
        this.projects = res;
      });
    });
  }

  stopTimer(modal: any) {
    this.modalService.open(modal);
  }

  // Helper function to add another zero
  addZero(n: number) {
    return ('0' + n).slice(-2);
  }

  getProjectDuration(index: number) {
    const project = this.projects[index];
    const start = new Date(project.start_time);

    if (project.end_time && project.end_time !== null) {
      const end = new Date(project.end_time);
      const diff_time = new Date(end.valueOf() - start.valueOf());
      const utc_diff_time =
        this.addZero(diff_time.getUTCHours()) +
        ':' +
        this.addZero(diff_time.getUTCMinutes()) +
        ':' +
        this.addZero(diff_time.getUTCSeconds());
      return utc_diff_time;
    }

    return '';
  }

  saveStoppedProject(modal: NgbModalRef) {
    if (!this.editingFlag) {
      this.projectService.stopTimer$(this.project_name).subscribe((_) => {
        this.project_name = '';
        this.clearTimerInterval();
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
    //TODO: it would be good practice to open modal "Are you sure you want to delte", but skip for now
    //when deleting active project reset timer interval
    if (this.activeProjectExists() && this.projects[index].end_time === null) {
      this.clearTimerInterval();
    }

    this.projectService.delete$(this.projects[index].id).subscribe((_) => {
      this.projectService
        .getAllProjects$()
        .subscribe((res) => (this.projects = res));
    });
  }

  removeAllProjects() {
    if (this.activeProjectExists()) {
      this.clearTimerInterval();
    }

    this.projectService.deleteAll$().subscribe((_) => {
      this.projectService.getAllProjects$().subscribe((res) => {
        this.projects = res;
      });
    });
  }

  downloadCsv() {
    // making json prettier for .csv format
    const projects_with_duration = this.projects.map((project, index) => ({
      ...project,
      start_time: new Date(project.start_time).toString(),
      end_time: project.end_time ? new Date(project.end_time).toString() : '',
      duration: this.getProjectDuration(index),
    }));

    const jsonForExport = JSON.parse(JSON.stringify(projects_with_duration));
    this.projectService.downloadFile(jsonForExport, 'Finished_projects');
  }
}
