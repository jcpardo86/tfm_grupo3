import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUsuario } from '../../interfaces/usuario.interface';

@Component({
  selector: 'app-nuevo-grupo',
  standalone: true,
  imports: [FooterComponent, ReactiveFormsModule],
  templateUrl: './nuevo-grupo.component.html',
  styleUrl: './nuevo-grupo.component.css'
})
export class NuevoGrupoComponent {
  modelForm: FormGroup;
  tipo: string = 'Añadir'
  isActualizar: boolean = false;
  arrUsuarios: IUsuario[];
  constructor(){

    if(this.checkActualizar()){
      this.modelForm = new FormGroup({
        nombreGrupo: new FormControl('Grupo Madrid', [
        Validators.required
        ]),
        descripcionGrupo: new FormControl('Grupo para el viaje de alumnos de la UNIR.', [
          Validators.required
        ])}, 
      [])  
    }else{
      this.modelForm = new FormGroup({
        nombreGrupo: new FormControl('', [
        Validators.required
        ]),
        descripcionGrupo: new FormControl('', [
          Validators.required
        ])}, 
      [])  
    }
    this.arrUsuarios = [
      { id: 1, nombre: "Marcos", porcentaje: 20 },
      { id: 2, nombre: "Nacho", porcentaje: 50 },
      { id: 3, nombre: "Alba", porcentaje: 30 }
    ];
  }

  checkActualizar():boolean{
    return this.isActualizar;
  }
}
