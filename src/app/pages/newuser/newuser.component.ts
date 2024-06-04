import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-newuser',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NavbarComponent],
  templateUrl: './newuser.component.html',
  styleUrls: ['./newuser.component.css'],
})
export class NewuserComponent {
  modelForm: FormGroup;

  constructor(private http: HttpClient, private router: Router) {
    this.modelForm = new FormGroup(
      {
        nombre: new FormControl(null, [
          Validators.required,
          Validators.minLength(3),
        ]),
        apellidos: new FormControl(null, [
          Validators.required,
          Validators.minLength(3),
        ]),
        email: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/),
        ]),
        repiteemail: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/),
        ]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
        repitepass: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
      },
      [this.checkPasswords, this.checkEmails]
    );
  }

  // Verificación de contraseña
  checkPasswords(group: AbstractControl): any {
    const password = group.get('password')?.value;
    const repitepass = group.get('repitepass')?.value;
    return password === repitepass ? null : { checkpassword: true };
  }

  // Verificación de email
  checkEmails(group: AbstractControl): any {
    const email = group.get('email')?.value;
    const repiteemail = group.get('repiteemail')?.value;
    return email === repiteemail ? null : { checkemail: true };
  }

  // Inicialización de datos
  ngOnInit(): void {
    // lo pido a BBDD
    let obj = {
      id: 1,
      nombre: 'Nombre',
      apellidos: 'Apellidos',
      email: 'jj@gmail.com',
      password: '12345',
    };
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

  // Verificación de errores de coincidencia
  checkControlPassword(): boolean | undefined {
    return (
      this.modelForm.hasError('checkpassword') &&
      this.modelForm.get('repitepass')?.touched
    );
  }

  checkControlEmail(): boolean | undefined {
    return (
      this.modelForm.hasError('checkemail') &&
      this.modelForm.get('repiteemail')?.touched
    );
  }

  // Envío de datos
  onClickGuardarBD() {
    if (this.modelForm.valid) {
      this.http
        .post('http://localhost:3000/api/users', this.modelForm.value).subscribe(
          (response) => {
            // handle successful response
            console.log('Formulario enviado satisfactoriamente', response);
            Swal.fire({
              icon: 'success',
              title: 'Registro exitoso',
              text: 'El formulario se ha enviado correctamente',
            });
            this.router.navigate(['/home']);
          },
          (error) => {
            console.error('Error en el envío del formulario', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al enviar el formulario',
            });
          }
        );
    } else {
      console.log('Error en el formulario');
      Swal.fire({
        icon: 'error',
        title: 'Formulario inválido',
        text: 'Por favor, corrige los errores en el formulario',
      });
    }
  }

 // Resetear el formulario
  onClickResetForm() {
    this.modelForm.reset();
    Object.keys(this.modelForm.controls).forEach(key => {
      this.modelForm.get(key)?.setErrors(null);
      this.modelForm.get(key)?.markAsPristine();
      this.modelForm.get(key)?.markAsUntouched();
    });
  }
}
