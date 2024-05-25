import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { UsersService } from '../../services/users.service';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [RouterOutlet, ReactiveFormsModule],
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
			const response = await this.usersService.login(this.loginForm.value);
			localStorage.setItem('token', response.token!);
			this.router.navigate(['/newgroup']) // redirigir a la página de usuario logueado;


		} catch (error: any) {
			console.log(error.error.error);


		}

	}


	// ngOnInit(): void {
	// 	// lo pido a BBDD
	// 	let obj = {
	// 		email: 'jj.com',
	// 		password: '12345',
	// 	}

	// 	this.loginForm = new FormGroup({
	// 		email: new FormControl(obj.email, [
	// 			Validators.required,
	// 			Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
	// 		]),
	// 		password: new FormControl(obj.password, [
	// 			Validators.required
	// 		]),
	// 	});
	// }



	getDataForm(): void {
		console.log(this.loginForm.value)
		this.loginForm.reset()
	}

	checkControl(formControlName: string, validator: string): boolean | undefined {
		return this.loginForm.get(formControlName)?.hasError(validator) && this.loginForm.get(formControlName)?.touched
	}
}
