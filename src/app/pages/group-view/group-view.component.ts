import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import Swal from 'sweetalert2';

import { GroupsService } from '../../services/groups.service';
import { UsersService } from '../../services/users.service';
import { SpentsService } from '../../services/spents.service';
import { DebtsService } from '../../services/debts.service';
import { IGroup } from '../../interfaces/igroup.interface';
import { IUser } from '../../interfaces/iuser.interface';
import { ISpent } from '../../interfaces/ispent.interface';
import { IDebt } from '../../interfaces/idebt.interface';
import { SpentCardComponent } from '../../components/spent-card/spent-card.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ChatComponent } from '../../components/chat/chat.component';
import { PayButtonComponent } from '../../components/pay-button/pay-button.component';

@Component({
  selector: 'app-group-view',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, SpentCardComponent, ChatComponent, RouterLink, PayButtonComponent],
  templateUrl: './group-view.component.html',
  styleUrl: './group-view.component.css'
})
export class GroupViewComponent {

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  //Inyectamos servicios GroupsService, UsersService, SpentsService y DebtsService, para gestión de grupos, usuarios, gastos y deudas
  groupService = inject(GroupsService);
  userService = inject(UsersService);
  spentService = inject(SpentsService);
  debtService = inject(DebtsService);

  idGroup!: number; //Propiedad para almacenar el id del grupo
  rol!: string; //Propiedad para almacenar el rol de usuario

  group: IGroup  = { //Objeto para almacenar los datos del grupo
    nombre: "",
    descripcion: "",
    imagen: ""
  };

  users: IUser[] = [];  //Array para almacenar el listado de usuarios(miembros) del grupo
  spents: ISpent[] = []; //Array para almacenar el listado de gastos del grupo
  totalSpent: number = 0; //Propiedad para almacenar el gasto total del grupo
  deudas: IDebt[] = [];  //Array para almacenar el listado de deudas del grupo
  images: string[] = []; //Array para almacenar las imagenes de usuarios del grupo

  todoLiquidado: boolean = true; 


 
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(async (params:any) =>{
      this.idGroup = params._id;
      const idUser = parseInt(localStorage.getItem('idUserLogueado') || '');

      //Solicitamos el rol de usuario logado y lo almacenamos en propiedad rol
      try {
        const [user] = await this.groupService.getUserGroup(idUser, this.idGroup);
        this.rol = user.rol;
      } catch(error) {
        console.log(error);
      }
      //Solicitamos los datos del grupo y lo almacenamos en objeto group
      try {
        this.group = await this.groupService.getGroupById(this.idGroup);
      } catch(error) {
        console.log(error);
      }
      //Solicitamos el listamos de usuarios del grupo y, por cada usuario su imagen y lo almacenamos en array users
      try {
        this.users = await this.groupService.getUsersByGroup(this.idGroup);
        console.log("estoy aquí")
        for(let i in this.users) {
          const response = await this.userService.getImageUser(this.users[i].idUsuario);
          this.users[i].imagen = (`http://localhost:3000/userimage/${this.users[i].imagen}`)
        }
      } catch(error) {
        console.log(error);
      }

      //Solicitamos el listado de gastos del grupo y los ordenamos por id de gasto
      try {
        this.spents = await this.spentService.getSpentsByGroup(this.idGroup);
        this.spents.sort((a: any, b: any) => {
          return a.idGasto - b.idGasto;
        }); 
      } catch(error) {
        console.log(error);
      }

      // Solicitamos el total de gasto del grupo
      try {
        this.totalSpent = await this.spentService.getTotalSpentByGroup(this.idGroup);
        if (this.totalSpent == null) {
          this.totalSpent = 0;
        }
      } catch(error) {
        console.log(error);
      }

      //Solicitamos el listado de deudas del grupo y si todas están pagadas, fijamos la propiedad todoLiquidado a true
      try {
        this.deudas = await this.debtService.getDebtsByGroup(this.idGroup);
        for(let deuda of this.deudas) {
          if(deuda.is_pagada !== 1){
            this.todoLiquidado = false;
            break;
          }
        }
      } catch(error) {
        console.log(error);
      }
    });
  }

 // Método para actualizar las deudas del grupo
  async updateDebtList() {
    try {
      this.deudas = await this.debtService.getDebtsByGroup(this.idGroup);
      this.deudas.sort((a: any, b: any) => {
      return a.idDeuda - b.idDeuda;
      }); 
      this.todoLiquidado = true;
      for(let deuda of this.deudas) {
        console.log(deuda);
        if(deuda.is_pagada !== 1){
          this.todoLiquidado = false;
          break;
        }
      }
    } catch(error) {
      console.log(error);
    }
  };

  //Método para cerrar grupo
  closeGroup() {
    Swal.fire({
      title: "¿Está seguro de que desea cerrar el grupo?",
      text: "Una vez cerrado, será eliminado de su listado de grupos",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FE5F42",
      cancelButtonColor: "#716add",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Sí, cerrar!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await this.groupService.updateStatusGroup({idGrupo: this.idGroup, status: "close"}); 
          console.log(response);
          Swal.fire({
            title: "Grupo cerrado!",
            text: "El grupo ha sido cerrado correctamente.",
            icon: "success",
            confirmButtonColor: "#FE5F42"
          });
          this.router.navigate(['/groups']); 
        } catch(error) {
          alert('Se ha producido un error al cerrar el grupo. Por favor, inténtelo de nuevo más tarde.')
        }
      }
    });
  }
}

