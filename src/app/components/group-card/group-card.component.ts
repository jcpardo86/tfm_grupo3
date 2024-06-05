import { Component, Input, inject } from '@angular/core';
import { IGroupUser } from '../../interfaces/igroup-user.interface';
import { Router, RouterLink } from '@angular/router';
import { GroupsService } from '../../services/groups.service';
import { IGroup } from '../../interfaces/igroup.interface';
import { IUser } from '../../interfaces/iuser.interface';
import { SpentsService } from '../../services/spents.service';

@Component({
  selector: 'app-group-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './group-card.component.html',
  styleUrl: './group-card.component.css'
})
export class GroupCardComponent {

  @Input() myGroup!: IGroupUser;

  group: IGroup = {
    idGrupo: 0,
    nombre: "",
    descripcion: "",
    imagen: ""
  }

  users: IUser[] = [];

  total: number = 0;

  groupService = inject(GroupsService);

  spentService = inject(SpentsService);

  router = inject(Router);

  async ngOnInit(): Promise<any> {

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

    try {
      const response = await this.spentService.getTotalSpentByGroup(this.myGroup.idGrupo);
      console.log('aquí', response);
      if (response !== null) {
        this.total = response;
      } else {
        this.total = 0;
      }
    } catch (err) {
      this.router.navigate(['/error']);
    }
  }

  // Método para truncar el texto a un número específico de palabras
  truncateText(text: string, limit: number): string {
    const words = text.split(' ');
    if (words.length > limit) {
      return words.slice(0, limit).join(' ') + '...';
    } else {
      return text;
    }
  }
}
