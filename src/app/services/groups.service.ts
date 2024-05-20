import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { IGroup } from '../interfaces/igroup.interface';
import { IGroupUser } from '../interfaces/igroup-user.interface';
import { IUser } from '../interfaces/iuser.interface';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  private httpClient = inject(HttpClient);
  private baseUrl : string = 'http://localhost:3000/api/groups'


  getGroupsByUser(idUser: number): Promise<IGroupUser[]> {
    return lastValueFrom(this.httpClient.get<IGroupUser[]>(`${this.baseUrl}/${idUser}`));
  }

  getUsersByGroup(idGroup: number): Promise<IUser[]> {
    return lastValueFrom(this.httpClient.get<IUser[]>(`${this.baseUrl}/users/${idGroup}`));
  }

  getGroupById(idGroup: number): Promise<IGroup> {
    return lastValueFrom(this.httpClient.get<IGroup>(`${this.baseUrl}/group/${idGroup}`));
  }

  insertGroup(group: IGroup): Promise<IGroup> {
    return lastValueFrom(this.httpClient.post<IGroup>(this.baseUrl, group))
  };

  insertUserToGroup(groupUser: IGroupUser): Promise<any>{
    return lastValueFrom(this.httpClient.post<IGroupUser>(this.baseUrl, groupUser))
  };

  deleteGroup(idGroup: number): Promise<any>{
    return lastValueFrom(this.httpClient.delete<IGroupUser>(`${this.baseUrl}/${idGroup}`));
  };

}