import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { LoginComponent } from '../../components/login/login.component';
import { RouterLink } from '@angular/router';
import { ResetPasswordComponent } from '../../components/reset-password/reset-password.component';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [FooterComponent, NavbarComponent, LoginComponent, RouterLink, ResetPasswordComponent],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css'
})
export class HomeComponent {

}
