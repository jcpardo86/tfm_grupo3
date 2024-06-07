import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';


type resetPassword = {
	email: string;
};



@Injectable({
	providedIn: 'root'

})
export class ResetService {
	private httpClient = inject(HttpClient);
	private baseUrl: string = 'http://localhost:3000/api/reset'

	postMail(email: resetPassword): Promise<any> {
		return lastValueFrom(this.httpClient.post<resetPassword>(`${this.baseUrl}`, email));
	};
}

