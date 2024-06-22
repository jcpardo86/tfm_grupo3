import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IDebt } from '../interfaces/idebt.interface';
import { lastValueFrom } from 'rxjs';
import { ISpent } from '../interfaces/ispent.interface';

@Injectable({
  providedIn: 'root'
})
export class DebtsService {

  private httpClient = inject(HttpClient);
  private baseUrl : string = 'http://localhost:3000/api/debts';


  // Servicio para obtener todas las deudas de un grupo a partir de su id de grupo
  getDebtsByGroup(id_group: number): Promise<IDebt[]> {
    return lastValueFrom(this.httpClient.get<IDebt[]>(`${this.baseUrl}/${id_group}`));
  };

  // Servicio para actualizar el listado de deudas de un grupo cuando se añade/modifica un gasto en el grupo
  updateDebtsByGroup(spent: ISpent): Promise<any> {
    return lastValueFrom(this.httpClient.put<any>(`${this.baseUrl}`, spent));
  };

  // Servicio para actualizar el estado de una deuda (pasa a estado pagada)
  updateStatus(debt: IDebt): Promise<any> { 
    return lastValueFrom(this.httpClient.put<any>(`${this.baseUrl}/status/${debt.idDeuda}`, debt));
  };

}
