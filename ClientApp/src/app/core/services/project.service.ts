import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../models';

const API_BASE = 'api/';
const PROJECT_URL = 'project';
const TIMER_START_URL = 'project/start';
const TIMER_STOP_URL = 'project/stop';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(
    private httpClient: HttpClient,
    @Inject('BASE_URL') private baseUrl: string
  ) {}

  getAllProjects$(): Observable<Project[]> {
    return this.httpClient.get<Project[]>(
      this.baseUrl + API_BASE + PROJECT_URL
    );
  }

  startTimer$(): Observable<boolean> {
    return this.httpClient.post<boolean>(
      this.baseUrl + API_BASE + TIMER_START_URL,
      null
    );
  }

  stopTimer$(name: string): Observable<boolean> {
    return this.httpClient.post<boolean>(
      this.baseUrl + API_BASE + TIMER_STOP_URL,
      {
        name: name,
      }
    );
  }

  edit$(id: number, name: string): Observable<boolean> {
    return this.httpClient.put<boolean>(
      `${this.baseUrl + API_BASE + PROJECT_URL}/${id}`,
      {
        name: name,
      }
    );
  }

  delete$(id: number): Observable<boolean> {
    return this.httpClient.delete<boolean>(
      `${this.baseUrl + API_BASE + PROJECT_URL}/${id}`
    );
  }
}
