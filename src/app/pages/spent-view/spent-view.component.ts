import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FooterComponent } from "../../components/footer/footer.component";
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ISpent } from '../../interfaces/ispent.interface';
import { formatCurrency, formatDate } from '@angular/common';
import { SpentsService } from '../../services/spents.service';
import { IUser } from '../../interfaces/iuser.interface';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-spent-view',
  standalone: true,
  imports: [FooterComponent, ReactiveFormsModule],
  templateUrl: './spent-view.component.html',
  styleUrl: './spent-view.component.css'
})
export class SpentViewComponent {
  modelForm: FormGroup;
  activatedRouter = inject(ActivatedRoute);
  tipo: string = 'Añadir';
  boton: string = 'Guardar';
  nombre_grupo: string = 'Grupo 1'
  isActualizar: boolean = false;
  spentService = inject(SpentsService);
  userService = inject(UsersService);
  usuarios: IUser[] = [];
  datosSelect: Array<Object> | undefined;
  constructor(){
    
    this.modelForm = new FormGroup({
      descripcion: new FormControl('',[]),
      importe: new FormControl('',[]),
      idUsuario: new FormControl('',[]),
      idGasto: new FormControl('',[]),
      idGrupo: new FormControl('',[]),
      fecha: new FormControl('2024-01-01',[])
    
    })

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
   
  }
  llenarDatosSelect(idGrupo: number):void {
    this.userService.getUsersByGrupo(idGrupo).subscribe((response: IUser[])=> {
      this.usuarios = response;

      console.log(this.usuarios);

    })
  }
  ngOnInit(){

  
    this.activatedRouter.params.subscribe(async (params:any)=>
    {
        console.log(params.id_group);
        console.log(params.id_spent);
        if(params.id_spent != 0){
          this.tipo = 'Actualizar'
          this.boton = 'Actualizar'

        const response = await this.spentService.spentById(params.id_spent);
        
        this.llenarDatosSelect(response.idGrupo);

       let fecha = formatDate(response.fecha, 'yyyy-MM-dd','en-US');
        this.modelForm = new FormGroup({
            descripcion: new FormControl(response.descripcion,[]),
            importe: new FormControl(response.importe,[]),
            idUsuario: new FormControl(response.idUsuario,[]),
            idGasto: new FormControl(response.idGasto,[]),
            idGrupo: new FormControl(response.idGrupo,[]),
            fecha: new FormControl(fecha,[])

          })

          
        }

        if(params.id_group && params.id_spent == 0){

          this.tipo = 'Agregar'
          this.boton = 'Agregar'

      
        
        this.llenarDatosSelect(params.id_group);
        let fecha = formatDate(Date.now(), 'yyyy-MM-dd','en-US');
        this.modelForm = new FormGroup({
            descripcion: new FormControl('',[]),
            importe: new FormControl('',[]),
            idUsuario: new FormControl('',[]),
            idGrupo: new FormControl(params.id_group,[]),
            fecha: new FormControl(fecha,[])
           
        })

        }

      })

  }

  async getDataForm(){
console.log(this.modelForm.value.idGasto)
    if(this.modelForm.value.idGasto != undefined){

      console.log(this.modelForm.value);
      const response = await this.spentService.updateSpent(this.modelForm.value);
  
      console.log(response);
    
    }
    else{
    
      console.log(this.modelForm.value);
      const response = await this.spentService.insertSpent(this.modelForm.value);
  
      console.log(response);
    
    }

  }


  checkActualizar():boolean{
    return this.isActualizar;
  }



}
