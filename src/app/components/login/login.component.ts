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

	// Inyecta el servicio FormBuilder para crear y gestionar formularios reactivos.
	formBuilder = inject(FormBuilder)

	// Inyecta el servicio UsersService para manejar operaciones relacionadas con los usuarios, como autenticación, registro y gestión de datos de usuario.
	usersService = inject(UsersService)

	// Inyecta el servicio Router para gestionar la navegación y manipulación de rutas dentro de la aplicación.
	router = inject(Router)

	constructor() {
		this.loginForm = this.formBuilder.group({
			email: new FormControl(null, [
				Validators.required,
				Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
			]),
			password: new FormControl(null, Validators.required)
		})
	}

	//método para enviar los datos del formulario al servidor
	async onSubmit() {
		try {
			const response = await this.usersService.loginUser(this.loginForm.value);

			localStorage.setItem('token', response.token!);
			localStorage.setItem('idUserLogueado', response.id_user);
			this.router.navigate([`/user/${response.id_user}`]);
		} catch (error: any) {
			alert("Email de usuario o contraseña incorrectos")
			console.log(error.error.error);
		}
	}

	// // Método para obtener y mostrar los datos del formulario en la consola y luego reiniciar el formulario.
	// getDataForm(): void {
	// 	console.log(this.loginForm.value)
	// 	this.loginForm.reset()
	// }

	// Método para verificar si un control específico tiene un error de validación.
	checkControl(formControlName: string, validator: string): boolean | undefined {
		return this.loginForm.get(formControlName)?.hasError(validator) && this.loginForm.get(formControlName)?.touched
	}
}
