import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { IUser } from '../interfaces/iuser.interface';

type LoginBody = {
	email: string;
	password: string;
};

type LoginResponse = {
	error?: string;
	success?: string;
	token?: string;
}


@Injectable({
	providedIn: 'root'
})
export class UsersService {

	private httpClient = inject(HttpClient);
	private baseUrl: string = 'http://localhost:3000/api/users'

  registerUser(user: IUser): Promise<IUser>{
    console.log("estoy en servicio registro")
    return lastValueFrom(this.httpClient.post<IUser>(`${this.baseUrl}/register`, user));
  };

  loginUser(user: any): Promise<any>{
    return lastValueFrom(this.httpClient.post<IUser>(`${this.baseUrl}/login`, user));
  };

  getUserById(idUser: number|null): Promise<IUser> {
    return lastValueFrom(this.httpClient.get<IUser>(`${this.baseUrl}/${idUser}`));
  };

  getUserByEmail(email: string): Promise<any> {
    return lastValueFrom(this.httpClient.get<any>(`${this.baseUrl}/email/${email}`));
  };

  getUsersByGrupo(idGroup: number): Observable<any>{
    console.log('service',idGroup);
    return this.httpClient.get<IUser[]>(`${this.baseUrl}/groups/Allusers/${idGroup}`);
  };

  getImageUser(id_user: number | undefined): Promise<any> {
    return lastValueFrom(this.httpClient.get<any>(`${this.baseUrl}/userimage/${id_user}`));
  };

  updateUser(user: IUser): Promise<any>{
    return lastValueFrom(this.httpClient.put<any>(`${this.baseUrl}/${user.idUsuario}`, user));
  }

}
