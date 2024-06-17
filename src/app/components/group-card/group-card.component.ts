import { Component, Input, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { IGroupUser } from '../../interfaces/igroup-user.interface';
import { IGroup } from '../../interfaces/igroup.interface';
import { IUser } from '../../interfaces/iuser.interface';

import { GroupsService } from '../../services/groups.service';
import { SpentsService } from '../../services/spents.service';

@Component({
  selector: 'app-group-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './group-card.component.html',
  styleUrl: './group-card.component.css'
})
export class GroupCardComponent {

  @Input() myGroup!: IGroupUser; //Input para obtención de datos usuario-grupo desde componente GroupList 
  @Input() myRol! : String; //Input para obtención de rol de usuario desde componente GroupList 

  group: IGroup = {  // Objeto para almacenar 
    idGrupo: 0,
    nombre: "",
    descripcion: "",
    imagen: ""
  };
  users: IUser[] = [];  // Array para almacenar el listado de usuarios del grupo
  total: number = 0; // Propiedad para almacenar el gasto total del grupo

  //Inyección de servicios GroupsService y SpentsServices para gestión de grupos y gastos
  groupService = inject(GroupsService);
  spentService = inject(SpentsService);

  //Inyección de router para redirecciones
  router = inject(Router);

  async ngOnInit(): Promise<any> {

    //Solicitamos los datos del grupo y lo almacenamos en objeto group
    try {
      const response = await this.groupService.getGroupById(this.myGroup.idGrupo);
      if (response != undefined) {
        this.group = response;
      } else {
        console.log('No se pueden obtener los datos del grupo')
      }

    } catch (err) {
      this.router.navigate(['/error']);
    }

    //Solicitamos el listado de usuarios(miembros) del grupo y lo almacenamos en array users
    try {
      const response = await this.groupService.getUsersByGroup(this.myGroup.idGrupo);
      if (response != undefined) {
        this.users = response;
      } else {
        console.log('No se pueden obtener los usuarios del grupo')
      }
    } catch (err) {
      this.router.navigate(['/error']);
    }

    //Solicitamos el gasto total del grupo y lo almacenamos en oropiedad total
    try {
      const response = await this.spentService.getTotalSpentByGroup(this.myGroup.idGrupo);
      console.log('aquí', response);
      if (response !== null) {
        this.total = response;
      } else {
        this.total = 0; //Si no hay gastos, asignamos el valor cero
      }
    } catch (err) {
      this.router.navigate(['/error']);
    }
  }

  //Método para truncar el texto a un número específico de palabras
  truncateText(text: string, limit: number): string {
    const words = text.split(' ');
    if (words.length > limit) {
      return words.slice(0, limit).join(' ') + '...';
    } else {
      return text;
    }
  }
}
