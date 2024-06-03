import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ResetPasswordComponent } from '../../components/reset-password/reset-password.component';

@Component({
	selector: 'app-reset',
	standalone: true,
	imports: [RouterLink, ResetPasswordComponent],
	templateUrl: './reset.component.html',
	styleUrl: './reset.component.css'
})
export class ResetComponent {

}
