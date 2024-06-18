import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { IMessage } from '../interfaces/imessage.interface';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
 
  private httpClient = inject(HttpClient);
  private baseUrl : string = 'http://localhost:3000/api/messages'

  // Servicio para obtener todos los mensajes de chat de un grupo a partir de su id de grupo
  getMessagesByGroup(idGroup: number): Promise<IMessage[]> {
    return lastValueFrom(this.httpClient.get<IMessage[]>(`${this.baseUrl}/${idGroup}`));
  };  
}
