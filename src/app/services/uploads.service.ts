import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UploadsService {

  private httpClient = inject(HttpClient);
	private baseUrl: string = 'http://localhost:3000/api/upload';

  updateImageUser(data: any): Promise<any> {
  return lastValueFrom(this.httpClient.post<any>(`${this.baseUrl}/userimage`, data));
  };

  updateImageGroup(data: any): Promise<any> {
    return lastValueFrom(this.httpClient.post<any>(`${this.baseUrl}/groupimage`, data));
    };
}
