import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IDebt } from '../interfaces/idebt.interface';
import { lastValueFrom } from 'rxjs';
import { IGroup } from '../interfaces/igroup.interface';
import { ISpent } from '../interfaces/ispent.interface';

@Injectable({
  providedIn: 'root'
})
export class DebtsService {

  private httpClient = inject(HttpClient);
  private baseUrl : string = 'http://localhost:3000/api/debts';

  getDebtsByGroup(id_group: number): Promise<IDebt[]> {
    return lastValueFrom(this.httpClient.get<IDebt[]>(`${this.baseUrl}/${id_group}`));
  };

  updateDebtsByGroup(spent: ISpent): Promise<any> {
    console.log("punto control");
    return lastValueFrom(this.httpClient.put<any>(`${this.baseUrl}`, spent));
  };

  updateStatus(debt: IDebt): Promise<any> { 
    return lastValueFrom(this.httpClient.put<any>(`${this.baseUrl}/status/${debt.idDeuda}`, debt));
  };

}
