import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GroupsService } from '../../services/groups.service';
import { IGroupUser } from '../../interfaces/igroup-user.interface';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { GroupCardComponent } from '../../components/group-card/group-card.component';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [NavbarComponent, GroupCardComponent, RouterLink],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.css'
})
export class GroupListComponent {

  //Inyección de ActivatedRoute para obtener params de ruta
  activatedRoute = inject(ActivatedRoute);
  //Inyección de Router para redirecciones
  router = inject(Router);

  //Inyección de servicios GroupsService y UsersService para gestiones de grupos y usuarios
  groupService = inject(GroupsService);
  
  arrGroups! : IGroupUser[]; //array para almacenar todos los grupos del usuario
  arrStatus : String[] = []; //propiedad para almacenar el estado del grupo
  arrRol : String[] = []; //propiedad para almacenar el rol del usuario


  async ngOnInit(): Promise<any> {

    //Obtenemos id de usuario logado del localstorage
    const id = parseInt(localStorage.getItem('idUserLogueado') || '');

    if (id) {
      //Solicitamos todos los grupos del usuario y lo almacenamos en array arrGroups
      try {
        const response = await this.groupService.getGroupsByUser(id);
        if(response!=undefined) {
          this.arrGroups = response;
          //Para cada objeto de arrGroups, solicitamos estado del grupo y rol de usuario y los almacenamos en los arrays arrStatus y arrRol
          for(let group of this.arrGroups){
            const status = await this.groupService.getStatusGroup(group.idGrupo);
            const [user] = await this.groupService.getUserGroup(id, group.idGrupo);
            this.arrStatus.push(status);
            this.arrRol.push(user.rol);
          } 
        } else {
          console.log('El usuario no pertenece a ningún grupo')
        }
      }catch(err){
        this.router.navigate(['/error']);
      }
    }
  }
}
