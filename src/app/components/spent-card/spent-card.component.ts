import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import dayjs from 'dayjs';

import { ISpent } from '../../interfaces/ispent.interface';
import { IUser } from '../../interfaces/iuser.interface';
import { UsersService } from '../../services/users.service';
import { SpentsService } from '../../services/spents.service';


@Component({
	selector: 'app-spent-card',
	standalone: true,
	imports: [RouterLink],
	templateUrl: './spent-card.component.html',
	styleUrl: './spent-card.component.css'
})
export class SpentCardComponent {

	@Input() mySpent!: ISpent; //Input para obtener los datos del gasto del componente GroupView

	@Input() numSpent!: number; //Input para obtener el número de gasto(contador) del componente GroupView

	@Input() rolUser!: string; //Input para obtener el rol del usuario del componente GroupView

	myUser: IUser = {  // Objeto para guardar los datos del usuario
		idUsuario: 0,
		nombre: "",
		apellidos: "",
		email: "",
		password: "",
		imagen: ""
	};

	//Inyección de servicios UsersService y SpentsService para gestión de usuarios y gastos
	userService = inject(UsersService);
	spentService = inject(SpentsService);

	async ngOnInit(): Promise<any> {

		//Formateamos la fecha y la almacenamos en propiedad fecha del objeto mySpent
		const date = dayjs(this.mySpent.fecha).format("YYYY-MM-DD");
		this.mySpent.fecha = date;

		//Solicitamos los datos del usuario y lo almacenamos en el objeto myUser
		try {
			const response = await this.userService.getUserById(this.mySpent.idUsuario);
			this.myUser = response;

		} catch (err) {
			console.log(err)
		}
	}
}

