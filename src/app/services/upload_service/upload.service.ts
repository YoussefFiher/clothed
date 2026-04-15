import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private url = 'http://localhost:5000/api/upload';
  constructor(private http: HttpClient) {}

  uploadImages(files: File[]): Observable<{ success: boolean; urls: string[] }> {
    const fd = new FormData();
    files.forEach(f => fd.append('images', f, f.name));
    return this.http.post<{ success: boolean; urls: string[] }>(this.url, fd);
  }
}
