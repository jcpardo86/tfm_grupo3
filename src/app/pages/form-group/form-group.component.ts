import { Component, inject } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUser } from '../../interfaces/iuser.interface';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IGroup } from '../../interfaces/igroup.interface';
import { GroupsService } from '../../services/groups.service';
import { IGroupUser } from '../../interfaces/igroup-user.interface';

@Component({
  selector: 'app-form-group',
  standalone: true,
  imports: [FooterComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './form-group.component.html',
  styleUrl: './form-group.component.css'
})
export class FormGroupComponent {
  userService = inject(UsersService);
  groupService = inject(GroupsService);
  router = inject(Router);

  modelForm: FormGroup;
  aniadirUsuarioForm: FormGroup;

  tipo: string = 'Añadir'
  isActualizar: boolean = false;
  existeUsuario: boolean = true;
  buttonPulsed: boolean = false;
  arrUsuarios: IUser[];

  newUser: IUser = {
    idUsuario: 0,
    nombre: "",
    apellidos: "",
    email: "",
    password: "",
    imagen: ""
  };

  constructor(){
    if(this.checkActualizar()){
      this.modelForm = new FormGroup({
        nombreGrupo: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
        descripcionGrupo: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.email
        ])
      }, 
      [])  
      this.arrUsuarios = [
        { idUsuario: 1, nombre: "Marcos", apellidos: "Marcos", email: "Marcos", password: "Marcos", imagen: "Marcos"},
        { idUsuario: 2, nombre: "Nacho", apellidos: "Marcos", email: "Marcos", password: "Marcos", imagen: "Marcos"},
        { idUsuario: 3, nombre: "Alba", apellidos: "Marcos", email: "Marcos", password: "Marcos", imagen: "Marcos"},
      ];

      this.aniadirUsuarioForm = new FormGroup({
        email: new FormControl('', [
          Validators.required,
          Validators.email
        ]),
        porcentaje: new FormControl('', [
          Validators.required,
          Validators.pattern("^100$|^([0-9]|[1-9][0-9])$")
        ])
      }, 
      [])  
    }else{
      this.modelForm = new FormGroup({
        nombreGrupo: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.required
        ]),
        descripcionGrupo: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ])
      }, 
      [])  

      this.arrUsuarios = [];

      this.aniadirUsuarioForm = new FormGroup({
        email: new FormControl('', [
          Validators.required,
          Validators.email
        ]),
        porcentaje: new FormControl('', [
          Validators.required,
          Validators.pattern("^100$|^([0-9]|[1-9][0-9])$")
        ])
      }, 
      [])  
    }
    
  }
  
  async aniadirUsuario() {
    if(!this.checkControlAniadir('email', 'required') && !this.checkControlAniadir('email', 'email') && !this.checkControlAniadir('porcentaje', 'required') && !this.checkControlAniadir('porcentaje', 'pattern')){
      const email = this.aniadirUsuarioForm.value.email;
      try{
        const response = await this.userService.getUserByEmail(email);
        if (response !== null) {
          this.newUser = response;
          this.newUser.porcentaje = this.aniadirUsuarioForm.value.porcentaje;
          this.existeUsuario = true;
          if(!this.arrUsuarios.find(user => user.email === email)){
            this.arrUsuarios.push(this.newUser);
          }
          if(this.correctPorcentajes()){
            this.buttonPulsed = false;
          }
        } else {
          this.existeUsuario = false;
        }
      }catch(err){
        this.router.navigate(['/error']);
      }
      console.log(this.arrUsuarios)
    }
    
  }
  
  checkActualizar():boolean{
    return this.isActualizar;
  }

  checkControlAniadir(formControlName: string, validador: string):boolean | undefined{
    return this.aniadirUsuarioForm.get(formControlName)?.hasError(validador) && this.aniadirUsuarioForm.get(formControlName)?.touched
  }

  checkControlGrupo(formControlName: string, validador: string):boolean | undefined{
    return this.modelForm.get(formControlName)?.hasError(validador) && this.modelForm.get(formControlName)?.touched
  }

  correctPorcentajes():boolean{
    let sumaPorcentaje: number = 0;
    this.arrUsuarios.forEach(usuario => {
      if(usuario.porcentaje) sumaPorcentaje += Number(usuario.porcentaje);
    });
    if(sumaPorcentaje == 100) return true
    if(this.arrUsuarios.length == 0) return true;
    return false;
  }

  async crearGrupo(){
    if(this.isActualizar){

    }else{
      console.log(this.modelForm.value.nombreGrupo)
      console.log(this.modelForm.value.descripcionGrupo)
      const newGroup: IGroup = {
        nombre: this.modelForm.value.nombreGrupo,
        descripcion: this.modelForm.value.descripcionGrupo,
        imagen: "prueba.png"
      };
      const response = await this.groupService.insertGroup(newGroup);
       
      //TODO: añadir ADMIN al usuario que está logueado y comprobar al crear grupo que el usuario logueado esta entro los miembros
      this.arrUsuarios.forEach(usuario => {
        const newGroup: IGroupUser = {
          idGrupo:  (response.idGroup !== undefined ? response.idGroup : 0),
          idUsuario: (usuario.idUsuario !== undefined ? usuario.idUsuario : 0),
          porcentaje: (usuario.porcentaje !== undefined ? usuario.porcentaje : 0),
          rol: 'ADMIN'
        };
        this.groupService.insertUserToGroup(newGroup);
      });

       alert(`Grupo ${response.nombre} creado correctamente.`)
       this.router.navigate([`/group/${response.idGroup}`])
      
    }
  }
}
