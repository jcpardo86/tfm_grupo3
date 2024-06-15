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

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  groupService = inject(GroupsService);
  
  arrGroups! : IGroupUser[];
  arrStatus : String[] = [];
  arrRol : String[] = [];


  async ngOnInit(): Promise<any> {

    //Cambio para recoger el id de usuario logado desde el localstorage

    const id = parseInt(localStorage.getItem('idUserLogueado') || '');
    if (id) {
      try {
        const response = await this.groupService.getGroupsByUser(id);
        if(response!=undefined) {
          this.arrGroups = response;
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

