import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UploadsService {

  private httpClient = inject(HttpClient);
	private baseUrl: string = 'http://localhost:3000/api/upload';

  // Servicio para subida de imagen de usuario a servidor de nodeJS
  updateImageUser(data: any): Promise<any> {
  return lastValueFrom(this.httpClient.post<any>(`${this.baseUrl}/userimage`, data));
  };

  // Servicio para subida de imagen de grupo a servidor de nodeJS
  updateImageGroup(data: any): Promise<any> {
    return lastValueFrom(this.httpClient.post<any>(`${this.baseUrl}/groupimage`, data));
    };
}
