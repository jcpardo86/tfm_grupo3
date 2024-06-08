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


  getGroupsByUser(idUser: number | undefined): Promise<IGroupUser[]> {
    return lastValueFrom(this.httpClient.get<IGroupUser[]>(`${this.baseUrl}/${idUser}`));
  }

  getUsersByGroup(idGroup: number | undefined): Promise<IUser[]> {
    return lastValueFrom(this.httpClient.get<IUser[]>(`${this.baseUrl}/users/${idGroup}`));
  }

  getGroupById(idGroup: number): Promise<IGroup> {
    return lastValueFrom(this.httpClient.get<IGroup>(`${this.baseUrl}/group/${idGroup}`));
  }

  getUserGroup(idUser: number | undefined, idGrupo: number | undefined): Promise<IGroupUser> {
    return lastValueFrom(this.httpClient.get<IGroupUser>(`${this.baseUrl}/${idUser}/${idGrupo}`));
  }

  updateGroupUser(group: IGroupUser): Promise<IGroupUser>{
    return lastValueFrom(this.httpClient.put<IGroupUser>(`${this.baseUrl}/updateGroupUser`, group));
  };


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

  updateGroup(group: IGroup): Promise<IGroup> {
    return lastValueFrom(this.httpClient.put<IGroup>(`${this.baseUrl}/update`, group));
  };

  insertUserToGroup(groupUser: IGroupUser): Promise<any> {
    return lastValueFrom(this.httpClient.post<IGroupUser>(`${this.baseUrl}/user/`, groupUser))
  };

  updateStatusGroup(status: updateStatusRequest): Promise<any> {
    console.log(status);
    return lastValueFrom(this.httpClient.put<any>(`${this.baseUrl}/close/${status.idGrupo}`, status.status));
  };

  deleteGroupUsers(idGroup: number): Promise<any>{
    return lastValueFrom(this.httpClient.delete<IGroupUser>(`${this.baseUrl}/deleteGroupUsers/${idGroup}`));
  };

  deleteGroup(idGroup: number | undefined): Promise<any> {
    return lastValueFrom(this.httpClient.delete<IGroupUser>(`${this.baseUrl}/${idGroup}`));
  };

}