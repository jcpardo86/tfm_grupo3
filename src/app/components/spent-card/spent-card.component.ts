import { Component, EventEmitter, Input, inject } from '@angular/core';
import { ISpent } from '../../interfaces/ispent.interface';
import { UsersService } from '../../services/users.service';
import { IUser } from '../../interfaces/iuser.interface';
import { RouterLink } from '@angular/router';
import dayjs from 'dayjs';
import { SpentsService } from '../../services/spents.service';

@Component({
	selector: 'app-spent-card',
	standalone: true,
	imports: [RouterLink],
	templateUrl: './spent-card.component.html',
	styleUrl: './spent-card.component.css'
})
export class SpentCardComponent {

	@Input() mySpent!: ISpent;

	@Input() numSpent!: number;

	@Input() rolUser!: string;

	myUser: IUser = {
		idUsuario: 0,
		nombre: "",
		apellidos: "",
		email: "",
		password: "",
		imagen: ""
	};

	userService = inject(UsersService);
	spentService = inject(SpentsService);

	async ngOnInit(): Promise<any> {

		const date = dayjs(this.mySpent.fecha).format("YYYY-MM-DD");
		this.mySpent.fecha = date;

		try {
			const response = await this.userService.getUserById(this.mySpent.idUsuario);
			this.myUser = response;

		} catch (err) {
			console.log(err)
		}

	}

}

