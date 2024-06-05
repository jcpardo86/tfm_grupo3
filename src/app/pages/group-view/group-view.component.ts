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

  deudas: Array<any> = [];

  router = inject(Router);

<<<<<<< Updated upstream


  ngOnInit(): void {
    this.activatedRoute.params.subscribe(async (params:any) =>{
      const id = params._id;
      try {
        const response_1 = await this.groupService.getGroupById(id);
        const response_2 = await this.groupService.getUsersByGroup(id);
        const response_3 = await this.spentService.getSpentsByGroup(id);
        const response_4 = await this.spentService.getTotalSpentByGroup(id);
        const response_5 = await this.spentService.getDeudas(id);

        if (response_1 != undefined && response_2 != undefined && response_3 != undefined && response_4 != undefined && response_5 != undefined) {
=======
  idGroup!: number;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(async (params:any) =>{
      this.idGroup = params._id;
      try{
        const response_1 = await this.groupService.getGroupById(this.idGroup);
        const response_2 = await this.groupService.getUsersByGroup(this.idGroup);
        const response_3 = await this.spentService.getSpentsByGroup(this.idGroup);
        const response_4 = await this.spentService.getTotalSpentByGroup(this.idGroup);
        const response_5 = await this.spentService.getDeudas(this.idGroup);
        if(response_1!=undefined && response_2!=undefined && response_3!=undefined && response_4!=undefined && response_5!=undefined) {
>>>>>>> Stashed changes
          this.group = response_1;
          this.users = response_2;
          this.spents = response_3.sort((a, b) => a.idGasto - b.idGasto);
          this.totalSpent = response_4.total_importe;

          for (let i = 0; i < response_5.length; i++) {
            this.deudas.push({ id_deuda: i, deuda: response_5[i] });
          }

          // Verificar si no hay gastos
          if (this.spents.length === 0) {
            this.totalSpent = 0;
            this.deudas.push({ id_deuda: 0, deuda: "" });
          }
        } else {
          console.log('No existen todos los datos del grupo');
        }
      } catch (err) {
        this.router.navigate(['/error']);
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

