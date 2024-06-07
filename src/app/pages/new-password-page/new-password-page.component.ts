import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, AbstractControl, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
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
		try {


			console.log("lo que pasa a la función", this.router.url.split('/')[2], this.newPassForm.value);

			await this.resetService.patchPassword(this.newPassForm.value, this.router.url.split('/')[2]);

			console.log(this.newPassForm.value);
			if (this.newPassForm.value.password && this.newPassForm.value.confirmPassword) {
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
				text: 'Algo salió mal al cambiar la contraseña',
				confirmButtonColor: '#FE5F42',
			});
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
