import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UsersService } from '../../services/users.service';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [RouterOutlet, ReactiveFormsModule, RouterLink],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css'
})
export class LoginComponent {
	loginForm: FormGroup;

	formBuilder = inject(FormBuilder)
	usersService = inject(UsersService)
	router = inject(Router)

	constructor() {
		this.loginForm = this.formBuilder.group({
			email: [null, Validators.required],
			password: [null, Validators.required]
		})
	}

	async onSubmit() {

		try {
			const response = await this.usersService.loginUser(this.loginForm.value);
			console.log(response.id_user);

			localStorage.setItem('token', response.token!);
			this.router.navigate([`/user/${response.id_user}`]);


		} catch (error: any) {
			console.log(error.error.error);


		}

	}





	getDataForm(): void {
		console.log(this.loginForm.value)
		this.loginForm.reset()
	}

	checkControl(formControlName: string, validator: string): boolean | undefined {
		return this.loginForm.get(formControlName)?.hasError(validator) && this.loginForm.get(formControlName)?.touched
	}
}
