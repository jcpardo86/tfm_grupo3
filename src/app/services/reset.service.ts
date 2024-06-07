import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';


type resetPassword = {
	email: string;
};

type newPassword = {
	email: string;
	confirmPassword: string;

}



@Injectable({
	providedIn: 'root'

})
export class ResetService {
	private httpClient = inject(HttpClient);
	private baseUrl: string = 'http://localhost:3000/api/reset'

	postMail(email: resetPassword): Promise<any> {
		return lastValueFrom(this.httpClient.post<resetPassword>(`${this.baseUrl}`, email));
	};

	// patchPassword(password: newPassword, token: string): Promise<any> {
	// 	console.log(`${this.baseUrl}/${token}`, password);

	// 	return lastValueFrom(this.httpClient.patch<newPassword>(`${this.baseUrl}/${token}`, password));
	// }

	patchPassword(passwordData: { password: string; confirmPassword: string }, token: string): Promise<any> {
		const url = `${this.baseUrl}/${token}`;
		console.log(`PATCH URL: ${url}`, passwordData); // Debug URL and data
		return lastValueFrom(this.httpClient.patch<any>(url, passwordData));
	}

}



