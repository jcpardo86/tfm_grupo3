import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, AbstractControl, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ResetService } from '../../services/reset.service';


@Component({
	selector: 'app-new-password-page',
	standalone: true,
	imports: [RouterLink, ReactiveFormsModule, RouterOutlet, NavbarComponent],
	templateUrl: './new-password-page.component.html',
	styleUrl: './new-password-page.component.css'
})
export class NewPasswordPageComponent {

	newPassForm: FormGroup;
	resetForm: any;

	formBuilder = inject(FormBuilder)
	resetService = inject(ResetService);

	constructor(private router: Router) {
		this.newPassForm = new FormGroup({
			password: new FormControl(null, [Validators.required]),
			confirmPassword: new FormControl(null, [Validators.required])
		}, [this.checkpassword]);
	}


	async onSubmit() {
		if (this.newPassForm.valid) {
			try {
				const currentUrl = this.router.url;
				const token = currentUrl.split('/')[2]; // Ajusta esto según la estructura de tu URL
				console.log(`Current URL: ${currentUrl}`); // Debug URL
				console.log(`Token: ${token}`); // Debug token

				const passwordData = {
					password: this.newPassForm.value.password,
					confirmPassword: this.newPassForm.value.confirmPassword
				};

				const response = await this.resetService.patchPassword(passwordData, token);

				console.log(this.newPassForm.value);
				if (response && response.success) { // Asegúrate de que 'response.success' sea el indicador de éxito de tu API
					Swal.fire({
						icon: 'success',
						title: 'Contraseña cambiada',
						text: 'La contraseña ha sido cambiada correctamente',
						confirmButtonColor: '#FE5F42',
					}).then(() => {
						this.router.navigate(['/home']);
					});
				}
			} catch (error: any) {
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'Algo salió mal al cambiar la contraseña',
					confirmButtonColor: '#FE5F42',
				});
			}
		}
	}



	checkpassword(formValue: AbstractControl): any {
		const password = formValue.get('password')?.value;
		const confirmPassword = formValue.get('confirmPassword')?.value;
		if (password !== confirmPassword) {
			return { 'checkpassword': true };
		} else {
			return null;
		}
	}

	getDataForm(): void {
		console.log(this.newPassForm.value);
		this.newPassForm.reset();
	}

}
