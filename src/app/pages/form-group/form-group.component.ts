import { Component, inject } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUser } from '../../interfaces/iuser.interface';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-form-group',
  standalone: true,
  imports: [FooterComponent, ReactiveFormsModule],
  templateUrl: './form-group.component.html',
  styleUrl: './form-group.component.css'
})
export class FormGroupComponent {

  modelForm: FormGroup;
  tipo: string = 'Añadir'
  isActualizar: boolean = false;
  arrUsuarios: IUser[];
  userService = inject(UsersService);
  router = inject(Router);

  constructor(){
    if(this.checkActualizar()){
      this.modelForm = new FormGroup({
        nombreGrupo: new FormControl('Grupo Madrid', [
          Validators.required,
          Validators.minLength(3),
        ]),
        descripcionGrupo: new FormControl('Grupo para el viaje de alumnos de la UNIR.', [
          Validators.required,
          Validators.minLength(3),
        ])}, 
      [])  
      this.arrUsuarios = [
        { idUsuario: 1, nombre: "Marcos", apellidos: "Marcos", email: "Marcos", password: "Marcos", imagen: "Marcos"},
        { idUsuario: 2, nombre: "Nacho", apellidos: "Marcos", email: "Marcos", password: "Marcos", imagen: "Marcos"},
        { idUsuario: 3, nombre: "Alba", apellidos: "Marcos", email: "Marcos", password: "Marcos", imagen: "Marcos"},
      ];
    }else{
      this.modelForm = new FormGroup({
        nombreGrupo: new FormControl('', [
          Validators.required,
          Validators.minLength(3),Validators.required
        ]),
        descripcionGrupo: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ])}, 
      [])  
      this.arrUsuarios = [];
    }
    
  }
  async ngOnInit(): Promise<any> {
    try{
      const response = await this.userService.getAllUsers();
      if (response !== undefined) {
        this.arrUsuarios = response;
      } else {
        console.log('El usuario no pertenece a ningún grupo');
      }
    }catch(err){
      this.router.navigate(['/error']);
    }

    console.log(this.arrUsuarios)
  }
  
  checkActualizar():boolean{
    return this.isActualizar;
  }

  correctPorcentajes():boolean{
    //Metodo para calcular que los porcentajes sumen 100
    return this.isActualizar;
  }
  
}
