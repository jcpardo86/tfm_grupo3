import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
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

  // Servicio para insertar un usuario
  registerUser(user: IUser): Promise<any>{
    return lastValueFrom(this.httpClient.post<any>(`${this.baseUrl}/register`, user));
  };

 // Servicio para login y generación de token
  loginUser(user: any): Promise<any>{
    return lastValueFrom(this.httpClient.post<any>(`${this.baseUrl}/login`, user));
  };

  // Servicio para obtener datos de un usuario (IUSER) a partir de su id de usuario.
  getUserById(idUser: number|null): Promise<IUser> {
    return lastValueFrom(this.httpClient.get<IUser>(`${this.baseUrl}/${idUser}`));
  };


  // Servicio para obtener datos de usuario (IUSER) a partir de su email de usuario.
  getUserByEmail(email: string): Promise<IUser> {
    return lastValueFrom(this.httpClient.get<IUser>(`${this.baseUrl}/email/${email}`));
  };

  //getUsersByGrupo(idGroup: number): Observable<any>{
    //return this.httpClient.get<IUser[]>(`${this.baseUrl}/groups/Allusers/${idGroup}`);
  //};

  // Servicio para obtener el nombre del fichero de imagen de perfil de un usuario a partir de su id de usuario
  getImageUser(id_user: number | undefined): Promise<any> {
    return lastValueFrom(this.httpClient.get<any>(`${this.baseUrl}/userimage/${id_user}`));
  };

  // Servicio para actualizar los datos de un usuario
  updateUser(user: IUser): Promise<any>{
    return lastValueFrom(this.httpClient.put<any>(`${this.baseUrl}/${user.idUsuario}`, user));
  }

}
