import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
 
  private httpClient = inject(HttpClient);
  private baseUrl : string = 'http://localhost:3000/api/messages'

  getMessagesByGroup(idGroup: number): Promise<any> {
    return lastValueFrom(this.httpClient.get<any>(`${this.baseUrl}/${idGroup}`));
  };
  
};
