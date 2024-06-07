import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UsersService } from '../../services/users.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-reset-password',
	standalone: true,
	imports: [ReactiveFormsModule, RouterLink, RouterOutlet],
	templateUrl: './reset-password.component.html',
	styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
	resetForm: FormGroup;

	// Inyecta el servicio FormBuilder para crear y gestionar formularios reactivos.
	formBuilder = inject(FormBuilder)

	// Inyecta el servicio UsersService para manejar operaciones relacionadas con los usuarios, como autenticación, registro y gestión de datos de usuario.
	usersService = inject(UsersService)

	// Inyecta el servicio Router para gestionar la navegación y manipulación de rutas dentro de la aplicación.
	router = inject(Router)


	constructor() {
		this.resetForm = this.formBuilder.group({
			email: new FormControl(null, [
				Validators.required,
				Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
			]),
		})
	}

	async onSubmit() {
		try {
			const response = await this.usersService.loginUser(this.resetForm.value);

			localStorage.setItem('token', response.token!);
			localStorage.setItem('idUserLogueado', response.id_user);
			this.router.navigate([`/user`]);
			//LE HE QUITADO EL ID PARA QUE RECOJA EL TOKEN DEL USUARIO REGISTRADO
			/*this.router.navigate([`/user/${response.id_user}`]);*/
		} catch (error: any) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'Usuario o contraseña incorrectos',
			})


			console.log(error.error.error);
		}
	}

	// Método para verificar si un control específico tiene un error de validación.
	checkControl(formControlName: string, validator: string): boolean | undefined {
		return this.resetForm.get(formControlName)?.hasError(validator) && this.resetForm.get(formControlName)?.touched
	}

}



