import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project, ProjectPaginated } from '../models';

const API_BASE = 'api/';
const PROJECT_URL = 'project';
const TIMER_START_URL = 'project/start';
const TIMER_STOP_URL = 'project/stop';
const DELETE_ALL_URL = 'project/delete_all';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(
    private httpClient: HttpClient,
    @Inject('BASE_URL') private baseUrl: string
  ) {}

  getAllProjects$(page?: number, limit?: number): Observable<ProjectPaginated> {
    let params = new HttpParams();

    if (page !== undefined) {
      params = params.append('page', page);
      if (limit !== undefined) params = params.append('limit', limit);
    }

    return this.httpClient.get<ProjectPaginated>(
      this.baseUrl + API_BASE + PROJECT_URL,
      {
        params: params,
      }
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

  deleteAll$(): Observable<boolean> {
    return this.httpClient.post<boolean>(
      this.baseUrl + API_BASE + DELETE_ALL_URL,
      null
    );
  }

  //For exporting json to csv.
  downloadFile(data: JSON, filename = 'data') {
    let csvData = this.ConvertToCSV(data, [
      'name',
      'start_time',
      'end_time',
      'duration',
    ]);
    //console.log(csvData);
    let blob = new Blob(['\ufeff' + csvData], {
      type: 'text/csv;charset=utf-8;',
    });
    let dwldLink = document.createElement('a');
    let url = URL.createObjectURL(blob);
    let isSafariBrowser =
      navigator.userAgent.indexOf('Safari') != -1 &&
      navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {
      //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute('target', '_blank');
    }
    dwldLink.setAttribute('href', url);
    dwldLink.setAttribute('download', filename + '.csv');
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  ConvertToCSV(objArray: JSON, headerList: Array<string>) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'Project.No,';

    for (let index in headerList) {
      row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = i + 1 + '';
      for (let index in headerList) {
        let head = headerList[index];

        line += ',' + array[i][head];
      }
      str += line + '\r\n';
    }
    return str;
  }
}
