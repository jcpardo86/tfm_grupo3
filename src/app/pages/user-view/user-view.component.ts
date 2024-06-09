import { Component, Type, inject } from '@angular/core';
import { GroupCardComponent } from '../../components/group-card/group-card.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GroupsService } from '../../services/groups.service';
import { IGroupUser } from '../../interfaces/igroup-user.interface';
import { NavbarComponent } from '../../components/navbar/navbar.component';


@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [GroupCardComponent, RouterLink, NavbarComponent],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.css'
})
export class UserViewComponent {

    activatedRoute = inject(ActivatedRoute);
    router = inject(Router);

    groupService = inject(GroupsService);
    
    arrGroups! : IGroupUser[];
    arrStatus : String[] = [];


    async ngOnInit(): Promise<any> {

      /* this.activatedRoute.params.subscribe(async (params:any) =>{
        console.log(params.id)
        const id = params._id;
        try{
          const response = await this.groupService.getGroupsByUser(id);
          if(response!=undefined) {
            this.arrGroups = response;
          } else {
            console.log('El usuario no pertenece a ningún grupo')
          }
        }catch(err){
          this.router.navigate(['/error']);
        }
      }) */


      //Cambio para recoger el id de usuario logado desde el localstorage

      const id = parseInt(localStorage.getItem('idUserLogueado') || '');
      if (id) {
        try {
          const response = await this.groupService.getGroupsByUser(id);
          if(response!=undefined) {
            this.arrGroups = response;
            for(let group of this.arrGroups){
              const status = await this.groupService.getStatusGroup(group.idGrupo);
              this.arrStatus.push(status);
            }
            console.log(this.arrStatus)
            } else {
            console.log('El usuario no pertenece a ningún grupo')
          }
        }catch(err){
          this.router.navigate(['/error']);
        }
      }
    }


}
