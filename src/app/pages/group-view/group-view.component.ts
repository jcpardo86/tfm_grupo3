import { Component, inject } from '@angular/core';
import { GroupsService } from '../../services/groups.service';
import { IGroup } from '../../interfaces/igroup.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { IUser } from '../../interfaces/iuser.interface';
import { SpentsService } from '../../services/spents.service';
import { ISpent } from '../../interfaces/ispent.interface';
import { SpentCardComponent } from '../../components/spent-card/spent-card.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ChatComponent } from '../../components/chat/chat.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-group-view',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, SpentCardComponent, ChatComponent, RouterLink],
  templateUrl: './group-view.component.html',
  styleUrl: './group-view.component.css'
})
export class GroupViewComponent {

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);


  groupService = inject(GroupsService);
  userService = inject(UsersService);
  spentService = inject(SpentsService);

  idGroup!: number;

  group: IGroup  = {
    nombre: "",
    descripcion: "",
    imagen: ""
  };

  users!: IUser[];
  spents!: ISpent[];
  totalSpent!: number;
  deudas: string[] = [];

 
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(async (params:any) =>{
      this.idGroup = params._id;
      try {
        this.group = await this.groupService.getGroupById(this.idGroup);
      } catch(error) {
        console.log(error);
      }

      try {
        this.users = await this.groupService.getUsersByGroup(this.idGroup);
      } catch(error) {
        console.log(error);
      }

      try {
        this.spents = await this.spentService.getSpentsByGroup(this.idGroup);
      } catch(error) {
        console.log(error);
      }

      try {
        this.totalSpent = await this.spentService.getTotalSpentByGroup(this.idGroup);
        console.log(this.totalSpent)
      } catch(error) {
        console.log(error);
      }

      try {
        this.deudas = await this.spentService.getDeudas(this.idGroup);
      } catch(error) {
        console.log(error);
      }
    });
  }

  onClickLiquidar(): void {

    Swal.fire({
      title: `¿ Está seguro de que desea liquidar los gastos del grupo "${this.group.nombre}" ?`,
      text: "Una vez liquidados los gastos el grupo será eliminado",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try{
          let response = await this.groupService.deleteGroup(this.group.idGrupo);
          console.log('Punto control', response);
          if (response.affectedRows === 1){
            this.successMessage();
            this.router.navigate(['/user']);
          }else{
            this.errorMessage();
          }
        }catch(err){
          this.errorMessage();
        }
      }
    })

  }

  errorMessage(): void {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Lo sentimos, se ha producido un error. Por favor, vuelva a intentarlo.",
    });
  }

  successMessage(): void {
    Swal.fire({
      title: "¡Cuentas saldadas!",
      text: `Todos los gastos están liquidados y el grupo "${this.group.nombre}" ha sido eliminado.`,
      icon: "success"
    });
  }

}

