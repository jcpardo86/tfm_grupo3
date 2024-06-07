import { Component } from '@angular/core';
import { ReactiveFormsModule, AbstractControl, FormGroup, FormControl, } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
	selector: 'app-new-password-page',
	standalone: true,
	imports: [RouterLink, ReactiveFormsModule, RouterOutlet, NavbarComponent],
	templateUrl: './new-password-page.component.html',
	styleUrl: './new-password-page.component.css'
})
export class NewPasswordPageComponent {

	newPassForm: FormGroup;

	constructor() {
		this.newPassForm = new FormGroup({

			password: new FormControl(null, []),
			repitepass: new FormControl(null, [])
		}, [this.checkpassword])
	}

	ngOnInit(): void {
		// lo pido a BBDD
		let obj = {

			password: '12345',
			repitepass: '12345'
		}



	}



	checkpassword(formValue: AbstractControl): any {
		const password = formValue.get('password')?.value;
		const repitepass = formValue.get('repitepass')?.value;
		if (password !== repitepass) {
			return { 'checkpassword': true }
		} else {
			return null
		}

	}




	getDataForm(): void {
		console.log(this.newPassForm.value)
		this.newPassForm.reset()
	}

	checkControl(formControlName: string, validador: string): boolean | undefined {
		return this.newPassForm.get(formControlName)?.hasError(validador) && this.newPassForm.get(formControlName)?.touched
	}
}



