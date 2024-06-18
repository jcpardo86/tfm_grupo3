import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { IGroup } from '../interfaces/igroup.interface';
import { IGroupUser } from '../interfaces/igroup-user.interface';
import { IUser } from '../interfaces/iuser.interface';

type updateStatusRequest = {
	idGrupo: number;
	status: string
}

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  private httpClient = inject(HttpClient);
  private baseUrl : string = 'http://localhost:3000/api/groups'


  // Servicio para obtener el listado de grupos de un usuario a partir de su id de usuario
  getGroupsByUser(idUser: number | undefined): Promise<IGroupUser[]> {
    return lastValueFrom(this.httpClient.get<IGroupUser[]>(`${this.baseUrl}/${idUser}`));
  };

  // Servicio para obtener el listado de usuarios de un grupo a partir de su id de grupo
  getUsersByGroup(idGroup: number | undefined): Promise<IUser[]> {
    return lastValueFrom(this.httpClient.get<IUser[]>(`${this.baseUrl}/users/${idGroup}`));
  };

  // Servicio para obtener los datos de un grupo a partir de su id de grupo
  getGroupById(idGroup: number): Promise<IGroup> {
    return lastValueFrom(this.httpClient.get<IGroup>(`${this.baseUrl}/group/${idGroup}`));
  };

  // Servicio para obtener datos de usuario como porcentaje de gasto, rol, saldo e importe liquidado a partir de id de usuario e id de grupo
  getUserGroup(idUser: number | undefined, idGroup: number | undefined): Promise<IGroupUser[]> {
    return lastValueFrom(this.httpClient.get<IGroupUser[]>(`${this.baseUrl}/${idUser}/${idGroup}`));
  };

  // Servicio para obtener el estado de un grupo (open o close)
  getStatusGroup(idGroup: number): Promise<string> {
    return lastValueFrom(this.httpClient.get<string>(`${this.baseUrl}/status/${idGroup}`));
  };

  // Servicio para obtener el nombre del fichero de imagen de un grupo a partir de su id de grupo
  getImageGroup(id_group: number | undefined): Promise<any> {
    return lastValueFrom(this.httpClient.get<any>(`${this.baseUrl}/groupimage/${id_group}`));
  };

  // Servicio para insertar un grupo
  insertGroup(group: IGroup): Promise<IGroup> {
    return new Promise((resolve, reject) => {
        this.httpClient.post<IGroup>(this.baseUrl, group).subscribe({
            next: (response: any) => {
                const insertId = response.insertId;
                const newGroupWithId: IGroup = { ...group, idGrupo: insertId };
                resolve(newGroupWithId);
            },
            error: (error: any) => {
                reject(error);
            }
        });
    });
  }

  // Servicio para actualizar los datos de un grupo (nombre y descripción)
  updateGroup(group: IGroup): Promise<IGroup> {
    return lastValueFrom(this.httpClient.put<IGroup>(`${this.baseUrl}/update`, group));
  };

  // Servicio para insertar un usuario en un grupo
  insertUserToGroup(groupUser: IGroupUser): Promise<any> {
    return lastValueFrom(this.httpClient.post<IGroupUser>(`${this.baseUrl}/user/`, groupUser))
  };

  // Servicio para actualizar el estado de un grupo (pasa estado a close)
  updateStatusGroup(status: updateStatusRequest): Promise<any> {
    console.log(status);
    return lastValueFrom(this.httpClient.put<any>(`${this.baseUrl}/status/${status.idGrupo}`, status));
  };

  // Servicio para borrar un grupo a partir de su id de grupo
  deleteGroup(idGroup: number | undefined): Promise<any> {
    return lastValueFrom(this.httpClient.delete<IGroupUser>(`${this.baseUrl}/${idGroup}`));
  };

}