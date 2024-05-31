import { Component, inject } from '@angular/core';
import { GroupsService } from '../../services/groups.service';
import { IGroup } from '../../interfaces/igroup.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { IUser } from '../../interfaces/iuser.interface';
import { SpentsService } from '../../services/spents.service';
import { ISpent } from '../../interfaces/ispent.interface';
import { SpentCardComponent } from '../../components/spent-card/spent-card.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ChatComponent } from '../../components/chat/chat.component';

@Component({
  selector: 'app-group-view',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, SpentCardComponent, ChatComponent],
  templateUrl: './group-view.component.html',
  styleUrl: './group-view.component.css'
})
export class GroupViewComponent {

  activatedRoute = inject(ActivatedRoute);

  groupService = inject(GroupsService);
  userService = inject(UsersService);
  spentService = inject(SpentsService);


  group: IGroup  = {
    idGrupo: 0,
    nombre: "",
    descripcion: "",
    imagen: ""
  };

  users!: IUser[];

  spents!: ISpent[];

  totalSpent!: number;

  deudas!: String[];

  router = inject(Router);

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(async (params:any) =>{
      const id = params._id;
      try{
        const response_1 = await this.groupService.getGroupById(id);
        const response_2 = await this.groupService.getUsersByGroup(id);
        const response_3 = await this.spentService.getSpentsByGroup(id);
        const response_4 = await this.spentService.getTotalSpentByGroup(id);
        const response_5 = await this.spentService.getDeudas(id);
        if(response_1!=undefined && response_2!=undefined && response_3!=undefined && response_4!=undefined && response_5!=undefined) {
          this.group = response_1;
          this.users = response_2;
          this.spents = response_3;
          this.totalSpent = response_4.total_importe;
          this.deudas = response_5;
          console.log('Estoy aquí', response_5);
      } else {
        console.log('No existen todos los datos del grupo')
      }
      }catch(err){
        this.router.navigate(['/error']);
      }
    })
  };



}
