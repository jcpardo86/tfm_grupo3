import { Component, Input, inject, input } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FooterComponent } from "../../components/footer/footer.component";
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { SpentsService } from '../../services/spents.service';
import { IUser } from '../../interfaces/iuser.interface';
import { GroupsService } from '../../services/groups.service';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-spent-view',
  standalone: true,
  imports: [FooterComponent, ReactiveFormsModule],
  templateUrl: './spent-view.component.html',
  styleUrl: './spent-view.component.css'
})
export class SpentViewComponent {

  tipo: string = 'AÑADIR';
  boton: string = 'Guardar';

  modelForm: FormGroup;

  activatedRouter = inject(ActivatedRoute);
  router = inject(Router);

  spentService = inject(SpentsService);
  groupService = inject(GroupsService);

  users: IUser[] = [];
 
  id_group!: number;
  
  constructor(){
    
    this.modelForm = new FormGroup({
      idGasto: new FormControl('',[]),
      idGrupo: new FormControl('',[]),
      idUsuario: new FormControl('',[]),
      descripcion: new FormControl('',[]),
      importe: new FormControl('',[]),
      fecha: new FormControl('',[]), 
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
        Swal.fire(`El gasto ha sido actualizado correctamente}"`);
        this.router.navigate([`/group/${response_1.idGrupo}`]);

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
      Swal.fire(`El gasto ha sido añadido al grupo correctamente`);
      this.router.navigate([`/group/${this.id_group}`]);

      } catch(error) {
        console.log(error);
      }
    }
  }


  ngOnInit() {

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
          descripcion: new FormControl(response.descripcion,[]),
          importe: new FormControl(response.importe,[]),
          fecha: new FormControl(response.fecha,[])
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
  }

  async datosSelect(idGrupo: number | undefined) {
    console.log('Estoy aquí', idGrupo);
    const response = await this.groupService.getUsersByGroup(idGrupo);
    this.users = response;
    console.log(this.users);
  }

}


