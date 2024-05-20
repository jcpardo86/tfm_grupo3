import { Component, inject } from '@angular/core';
import { GroupCardComponent } from '../../components/group-card/group-card.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GroupsService } from '../../services/groups.service';
import { IGroupUser } from '../../interfaces/igroup-user.interface';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [GroupCardComponent, RouterLink],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.css'
})
export class UserViewComponent {

    groupService = inject(GroupsService);

    activatedRoute = inject(ActivatedRoute);
  

    arrGroups : IGroupUser[] = []; //arrUsers es un array de arrays de user (un elemento por página)
  
    router = inject(Router);

  
    async ngOnInit(): Promise<any> {

      this.activatedRoute.params.subscribe(async (params:any) =>{
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
      })
    }
}

