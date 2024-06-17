import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import Swal from 'sweetalert2';

import { ResetService } from '../../services/reset.service';


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

	// Inyecta el servicio ResettService para manejar operaciones relacionadas con los usuarios, como autenticación, registro y gestión de datos de usuario.
	resetService = inject(ResetService)

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
			if (this.resetForm.value.email) {
				Swal.fire({
					icon: 'success',
					title: 'Mail enviado',
					text: 'Hemos enviado un mail a tu correo para que puedas restablecer tu contraseña',
					confirmButtonColor: '#FE5F42',
				}).then(() => {
					this.router.navigate([`/home`]);
				});

			}

		} catch (error: any) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'Usuario incorrecto',
				confirmButtonColor: '#FE5F42',
			})


		}

	}



	// Método para verificar si un control específico tiene un error de validación.
	checkControl(formControlName: string, validator: string): boolean | undefined {
		return this.resetForm.get(formControlName)?.hasError(validator) && this.resetForm.get(formControlName)?.touched
	}

}



