import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [FooterComponent],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css'
})
export class HomeComponent {

}
