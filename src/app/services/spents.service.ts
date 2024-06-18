import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ISpent } from '../interfaces/ispent.interface';
import { lastValueFrom } from 'rxjs';
import { IDebt } from '../interfaces/idebt.interface';

type userGroup = {
	idUsuario: number | undefined;
	idGrupo: number;
};

@Injectable({
  providedIn: 'root'
})
export class SpentsService {

  private httpClient = inject(HttpClient);
  private baseUrl : string = 'http://localhost:3000/api/spents'


  // Servicio para obtener todos los gastos de un grupo a partir del id de grupo
  getSpentsByGroup(idGroup: number): Promise<ISpent[]> {
    return lastValueFrom(this.httpClient.get<ISpent[]>(`${this.baseUrl}/${idGroup}`));
  };

  // Servicio para obtener el gasto total de un grupo a partir del id de grupo
  getTotalSpentByGroup(idGroup: number): Promise<any> {
    return lastValueFrom(this.httpClient.get<any>(`${this.baseUrl}/total/${idGroup}`));
  };

  // Servicio para obtener los datos de un gasto a partir de su id de gasto
  getspentById(idGasto: number): Promise<ISpent>{
    return lastValueFrom(this.httpClient.get<ISpent>(`${this.baseUrl}/spent/${idGasto}`));
  };

  // Servicio para insertar un gasto
  insertSpent(spent: ISpent): Promise<any> {
    return lastValueFrom(this.httpClient.post<ISpent>(`${this.baseUrl}`, spent));
  };

  // Servicio para actualizar los datos de un gasto
  updateSpent(spent: ISpent): Promise<any> {
    return lastValueFrom(this.httpClient.put<ISpent>(`${this.baseUrl}/${spent.idGasto}`, spent));
  };

  // Servicio para actualizar el saldo de un usuario de un grupo
  updateSaldo(user_group: userGroup): Promise<any> {
    console.log(user_group);
    return lastValueFrom(this.httpClient.put<userGroup>(`${this.baseUrl}/`, user_group));
  };

  // Servicio para actualizar el estado de una deuda (pasar deuda a liquidada)
  updateLiquidado(debt: IDebt): Promise<any> {
    return lastValueFrom(this.httpClient.put<IDebt>(`${this.baseUrl}/liquidar/${debt.idGrupo}`, debt))
  };

  // Servicio para borrar un gasto a partir de su id de gasto
  deleteSpent(id_debt: number): Promise<any> {
    return lastValueFrom(this.httpClient.delete<any>(`${this.baseUrl}/${id_debt}`))
  };
}