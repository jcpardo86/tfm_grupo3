import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { LoginComponent } from '../../components/login/login.component';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [FooterComponent, NavbarComponent, LoginComponent],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css'
})
export class HomeComponent {

}
