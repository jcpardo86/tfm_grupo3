import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
	selector: 'app-page-not-found',
	standalone: true,
	imports: [RouterModule, NavbarComponent],
	templateUrl: './page-not-found.component.html',
	styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent {

}
