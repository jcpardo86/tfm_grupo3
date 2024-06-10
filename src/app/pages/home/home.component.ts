import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { LoginComponent } from '../../components/login/login.component';
import { RouterLink } from '@angular/router';
import { ResetPasswordComponent } from '../../components/reset-password-form/reset-password.component';
import { UploadButtonComponent } from '../../components/upload-button/upload-button.component';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [FooterComponent, NavbarComponent, LoginComponent, RouterLink, ResetPasswordComponent, UploadButtonComponent],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css'
})
export class HomeComponent {

}
