import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ISpent } from '../interfaces/ispent.interface';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpentsService {

  private httpClient = inject(HttpClient);
  private baseUrl : string = 'http://localhost:3000/api/spents'


  getSpentsByGroup(idGroup: number): Promise<ISpent[]> {
    return lastValueFrom(this.httpClient.get<ISpent[]>(`${this.baseUrl}/${idGroup}`));
  };

  getTotalSpentByGroup(idGroup: number): Promise<any> {
    return lastValueFrom(this.httpClient.get<any>(`${this.baseUrl}/total/${idGroup}`));
  };

  getDeudas(idGroup: number): Promise<any> {
    return lastValueFrom(this.httpClient.get<any>(`${this.baseUrl}/saldos/${idGroup}`));
  };

  insertSpent(spent: ISpent): Promise<any> {
    return lastValueFrom(this.httpClient.post<ISpent>(`${this.baseUrl}`, spent));
  };


}