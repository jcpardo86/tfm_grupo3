import { Component, Input, inject } from '@angular/core';
import { ISpent } from '../../interfaces/ispent.interface';
import { UsersService } from '../../services/users.service';
import { IUser } from '../../interfaces/iuser.interface';

@Component({
  selector: 'app-spent-card',
  standalone: true,
  imports: [],
  templateUrl: './spent-card.component.html',
  styleUrl: './spent-card.component.css'
})
export class SpentCardComponent {

  @Input() mySpent!: ISpent;

  @Input() numSpent!: number;

  myUser: IUser = {
    idUsuario: 0,
    nombre: "",
    apellidos: "",
    email: "",
    password: ""
  };

  userService = inject(UsersService);

  async ngOnInit(): Promise<any>{

    try{
      const response = await this.userService.getUserById(this.mySpent.idUsuario);
      this.myUser = response;

    } catch(err){
      console.log(err)
    }

  }
}

