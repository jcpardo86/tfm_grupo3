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
import { REACTIVE_NODE } from '@angular/core/primitives/signals';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-form-spent',
  standalone: true,
  imports: [FooterComponent, ReactiveFormsModule,NavbarComponent],
  templateUrl: './form-spent.component.html',
  styleUrl: './form-spent.component.css'
})
export class FormSpentComponent {

  tipo: string = 'AÑADIR';
  boton: string = 'Guardar';

  modelForm: FormGroup;

  activatedRouter = inject(ActivatedRoute);
  router = inject(Router);

  spentService = inject(SpentsService);
  debtService = inject(DebtsService)
  groupService = inject(GroupsService);

  users: IUser[] = [];
 
  id_group!: number;

  image: String = "";
  
  constructor(){
    
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
        // Validators.pattern(/^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$/gm)
        Validators.pattern(/^[0-9]+([.][0-9]+)?$/)
      ]),
      fecha: new FormControl('',[
        Validators.required
      ]), 
    }, [])

  }

    // if(this.checkActualizar()){
    //   this.modelForm = new FormGroup({
    //     nombreGrupo: new FormControl('Grupo Madrid', [
    //     Validators.required
    //     ]),
    //     descripcionGrupo: new FormControl('Grupo para el viaje de alumnos de la UNIR.', [
    //       Validators.required
    //     ])}, 
    //   [])  
    // }else{
    //   this.modelForm = new FormGroup({
    //     nombreGrupo: new FormControl('', [
    //     Validators.required
    //     ]),
    //     descripcionGrupo: new FormControl('', [
    //       Validators.required
    //     ])}, 
    //   [])  
    // }
   


  async getDataForm(): Promise<any> {

    if(this.modelForm.value.idGasto) {
    
      try {
        const response_1 = await this.spentService.updateSpent(this.modelForm.value);
        for(let user of this.users) {
          const response_2 = await this.spentService.updateSaldo({idGrupo: parseInt(this.modelForm.value.idGrupo), idUsuario: user.idUsuario});
        }
        const response_3 = await this.debtService.updateDebtsByGroup(this.modelForm.value);

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
      
      this.modelForm.value.idGrupo = this.id_group;

      try {

      console.log(this.modelForm.value.idGrupo);
      console.log(this.users);
      const response = await this.spentService.insertSpent(this.modelForm.value);
      for(let user of this.users) {
        const response_2 = await this.spentService.updateSaldo({idGrupo: parseInt(this.modelForm.value.idGrupo), idUsuario: user.idUsuario}); 
      }

      const response_3 = await this.debtService.updateDebtsByGroup(this.modelForm.value);

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
      
      if(params.id_spent) {
        this.tipo = 'ACTUALIZAR'
        this.boton = 'Actualizar'

        const response = await this.spentService.spentById(params.id_spent)
        
        this.datosSelect(response.idGrupo);

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
          
      } else {

        this.id_group = params.id_group;

        this.datosSelect(this.id_group);

        //let fecha = formatDate(Date.now(), 'yyyy-MM-dd','en-US');
        //this.modelForm = new FormGroup({
            //descripcion: new FormControl('',[]),
            //importe: new FormControl('',[]),
            //idUsuario: new FormControl('',[]),
            //idGrupo: new FormControl(params.id_group,[]),
            //fecha: new FormControl(fecha,[])
           
      }
    })

    try {
      const response = await this.groupService.getImageGroup(this.id_group);

      if(response[0]!==undefined) {
        this.image = (`http://localhost:3000/groupimage/${response[0].imagen}`)
      }
  } catch(error) {
    console.log(error);
  }
  }

  async datosSelect(idGrupo: number | undefined) {
    console.log('Estoy aquí', idGrupo);
    const response = await this.groupService.getUsersByGroup(idGrupo);
    this.users = response;
    console.log(this.users);
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

