import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ResetPasswordComponent } from '../../components/reset-password-form/reset-password.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
	selector: 'app-reset',
	standalone: true,
	imports: [RouterLink, ResetPasswordComponent, NavbarComponent],
	templateUrl: './reset.component.html',
	styleUrl: './reset.component.css'
})
export class ResetComponent {

}
