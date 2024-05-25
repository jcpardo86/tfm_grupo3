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

  registertUser(user: IUser): Promise<IUser>{
    return lastValueFrom(this.httpClient.post<IUser>(`${this.baseUrl}/register`, user));
  };

	registertUser(user: IUser): Promise<IUser> {
		return lastValueFrom(this.httpClient.post<IUser>(`${this.baseUrl}/register`, user));
	};

  getUserById(idUser: number): Promise<IUser> {
    return lastValueFrom(this.httpClient.get<IUser>(`${this.baseUrl}/${idUser}`));
  };

  getUserByEmail(email: string): Promise<IUser> {
    return lastValueFrom(this.httpClient.get<IUser>(`${this.baseUrl}/email/${email}`));
  };
  
}
