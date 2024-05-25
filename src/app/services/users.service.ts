import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

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

	//métodos para interactuar con la api de usuarios

	private baseUrl: string = `${environment.apiUrl}/users`;


	private httClient = inject(HttpClient);

	//método para hacer login
	login(body: LoginBody): Promise<LoginResponse> {

		return firstValueFrom(
			this.httClient.post<LoginResponse>(`${this.baseUrl}/login`, body)

		);

	}

	constructor() { }
}

