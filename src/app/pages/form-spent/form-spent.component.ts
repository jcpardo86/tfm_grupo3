import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import dayjs from 'dayjs';
import Swal from 'sweetalert2';

import { SpentsService } from '../../services/spents.service';
import { DebtsService } from '../../services/debts.service';
import { GroupsService } from '../../services/groups.service';
import { IUser } from '../../interfaces/iuser.interface';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-form-spent',
  standalone: true,
  imports: [FooterComponent, ReactiveFormsModule,NavbarComponent],
  templateUrl: './form-spent.component.html',
  styleUrl: './form-spent.component.css'
})
export class FormSpentComponent {

  //Inyección de ActivatedRoute para obtener params de ruta
  activatedRouter = inject(ActivatedRoute);
  //Inyección de Router para redirecciones
  router = inject(Router);

  //Inyección de servicios SpentsService, DebtsService y GroupsService, para gestión de gastos, deudas y grupos
  spentService = inject(SpentsService);
  debtService = inject(DebtsService)
  groupService = inject(GroupsService);

  tipo: string = 'AÑADIR';
  boton: string = 'Guardar';

  modelForm: FormGroup;

  users: IUser[] = []; //Objeto para almacenar el listado de usuarios del grupo
 
  id_group!: number;  //Propiedad para almacenar el id del grupo

  image: String = "";  //Propiedad para almacenar la imagen del grupo
  
  constructor() {
    this.modelForm = new FormGroup({
      idGasto: new FormControl('',[]),
      idGrupo: new FormControl('',[]),
      idUsuario: new FormControl('',[
        Validators.required,
      ]),
      descripcion: new FormControl('',[
        Validators.required
      ]),
      importe: new FormControl('',[
        Validators.required,
        Validators.pattern(/^[0-9]+([.][0-9]+)?$/)
      ]),
      fecha: new FormControl('',[
        Validators.required
      ]), 
    }, [])

  }

  async getDataForm(): Promise<any> {

    if(this.modelForm.value.idGasto) {
      // Formulario de actualización:
      try {
        //Solicitamos actualización del gasto en BBDD
        const response_1 = await this.spentService.updateSpent(this.modelForm.value);
        //Solicitamos actualización del saldo de todos los usuarios del grupo en BBDD
        for(let user of this.users) {
          const response_2 = await this.spentService.updateSaldo({idGrupo: parseInt(this.modelForm.value.idGrupo), idUsuario: user.idUsuario});
        }
        //Solicitamos actualización de deudas del grupo en BBDD
        const response_3 = await this.debtService.updateDebtsByGroup(this.modelForm.value);

        //Mensaje para informar al usuario de que el gasto ha sido actualizado
        Swal.fire({
          text: "El gasto ha sido actualizado",
          icon: "success",
          confirmButtonColor: "#FE5F42"
        });
        this.router.navigate([`/group/${response_1.idGrupo}`])

      } catch(error) {
        console.log(error);
      }
    } else {
      //Formulario de registro:
      this.modelForm.value.idGrupo = this.id_group;
      try {
        // Solicitamos inserción de nuevo gasto en BBDD
        const response_1 = await this.spentService.insertSpent(this.modelForm.value);
        //Solicitamos actualización del saldo de todos los usuarios del grupo en BBDD
        for(let user of this.users) {
          const response_2 = await this.spentService.updateSaldo({idGrupo: parseInt(this.modelForm.value.idGrupo), idUsuario: user.idUsuario}); 
        }
        //Solicitamos actualización de deudas del grupo en BBDD
        const response_3 = await this.debtService.updateDebtsByGroup(this.modelForm.value);

        //Mensaje para informar al usuario de que el gasto ha sido añadido al grupo
        Swal.fire({
          text: "El gasto ha sido añadido al grupo",
          icon: "success",
          confirmButtonColor: "#FE5F42"
        });
        this.router.navigate([`/group/${this.id_group}`]);

      } catch(error) {
        console.log(error);
      }
    }
  }


  async ngOnInit() {

    this.activatedRouter.params.subscribe(async (params:any) => {
      
      if (params.id_spent) { 
        //Formulario actualizar: cumplimentamos los datos del gasto en el formulario 
        this.tipo = 'ACTUALIZAR'
        this.boton = 'Actualizar'
        try {
          const response = await this.spentService.spentById(params.id_spent)
          this.id_group = response.idGrupo;
          const date = dayjs(response.fecha).format("YYYY-MM-DD");
		      response.fecha = date;

          this.modelForm = new FormGroup({
          idGasto: new FormControl(response.idGasto,[]),
          idGrupo: new FormControl(response.idGrupo,[]),
          idUsuario: new FormControl(response.idUsuario,[]),
          descripcion: new FormControl(response.descripcion,[
            Validators.required
          ]),
          importe: new FormControl(response.importe,[
            Validators.required
          ]),
          fecha: new FormControl(response.fecha,[
            Validators.required
          ])
          }, []);
        } catch (error) {
          console.log(error);
        }

        try {
          const response = await this.groupService.getImageGroup(this.id_group);
          if(response[0]!==undefined) {
            this.image = (`http://localhost:3000/groupimage/${response[0].imagen}`)
          }
        } catch(error) {
          console.log(error);
        }
          
      } else {
        //Formulario nuevo registro de gasto
        this.id_group = params.id_group;
        this.datosSelect(this.id_group);
       // Solicitamos la imagen del grupo para mostrar en el formulario
      try {
        const response = await this.groupService.getImageGroup(this.id_group);
        if(response[0]!==undefined) {
          this.image = (`http://localhost:3000/groupimage/${response[0].imagen}`)
        }
      } catch(error) {
        console.log(error);
      } 
    }
  });
}

  // Método para obtener el listado de usuarios(miembros) de un grupo, para mostrar en las opciones del Select (form de registro) o como información (form de actualización).
  async datosSelect(idGrupo: number | undefined) {
    try {
      const response = await this.groupService.getUsersByGroup(idGrupo);
      this.users = response;
    } catch(error) {
      console.log(error);
    }
  }

  // Verificación de campos
  checkControl(
    formControlName: string,
    validador: string
  ): boolean | undefined {
    return (
      this.modelForm.get(formControlName)?.hasError(validador) &&
      this.modelForm.get(formControlName)?.touched
    );
  }

}

