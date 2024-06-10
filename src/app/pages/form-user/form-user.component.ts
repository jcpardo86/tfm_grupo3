import { Component, inject } from '@angular/core';
<<<<<<< HEAD:src/app/pages/form-user/form-user.component.ts
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsersService } from '../../services/users.service';
import { IUser } from '../../interfaces/iuser.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-form-user',
  standalone: true,
  imports: [ReactiveFormsModule, NavbarComponent, RouterLink],
  templateUrl: './form-user.component.html',
  styleUrl: './form-user.component.css'
})
export class FormUserComponent {
  modelForm: FormGroup;
  userService = inject(UsersService);
  user: IUser = {
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    imagen: '',
  };
  titleForm: string = "Registro nuevo usuario";
  textBottom: string = "GUARDAR";
=======
import {
	AbstractControl,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import Swal from 'sweetalert2';
import { UsersService } from '../../services/users.service';
import { IUser } from '../../interfaces/iuser.interface';
import { UploadButtonComponent } from '../../components/upload-button/upload-button.component';

@Component({
	selector: 'app-newuser',
	standalone: true,
	imports: [ReactiveFormsModule, RouterLink, NavbarComponent, UploadButtonComponent],
	templateUrl: './newuser.component.html',
	styleUrls: ['./newuser.component.css'],
})
export class NewuserComponent {
	modelForm: FormGroup;
	userService = inject(UsersService);
	user: IUser = {
		nombre: '',
		apellidos: '',
		email: '',
		password: '',
		imagen: '',
	};
	titleForm: string = "Registro nuevo usuario";
	textBottom: string = "Guardar";
>>>>>>> upload-images:src/app/pages/newuser/newuser.component.ts

	activatedRoute = inject(ActivatedRoute)

	imageURL: string | null = null;


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
				imagen: new FormControl(null, [Validators.required]),
			},
			[this.checkpasswords, this.checkemails]
		);
	}

<<<<<<< HEAD:src/app/pages/form-user/form-user.component.ts
  // Inicialización de datos
  ngOnInit(): void {
    // lo pido a BBDD
    this.activatedRoute.params.subscribe(async (params: any) => {
      if(params.id_user) {
        this.titleForm = "Actualizar usuario";
        this.textBottom = "ACTUALIZAR";
        const response = await this.userService.getUserById(params.id_user);
        if (response) {
          this.modelForm = new FormGroup(
            {
              idUsuario: new FormControl(response.idUsuario),
              nombre: new FormControl(response.nombre, [Validators.required, Validators.minLength(3)]),
              apellidos: new FormControl(response.apellidos, [Validators.required, Validators.minLength(3)]),
              email: new FormControl(response.email, [Validators.required, Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)]),
              repiteemail: new FormControl(response.email, [Validators.required, Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)]),
              password: new FormControl("", [Validators.required, Validators.minLength(6)]),
              repitepass: new FormControl("", [Validators.required, Validators.minLength(6)]),
              imagen: new FormControl(response.imagen, [Validators.required]),
            },
            [this.checkpasswords, this.checkemails]
          );
        }
      }
    });
 
  }
=======
	// Verificación de contraseña
	checkpasswords(group: AbstractControl): any {
		const password = group.get('password')?.value;
		const repitepass = group.get('repitepass')?.value;
		return ((password !== repitepass) ? { 'checkpasswords': true } : null);
	}
>>>>>>> upload-images:src/app/pages/newuser/newuser.component.ts

	// Verificación de email
	checkemails(group: AbstractControl): any {
		const email = group.get('email')?.value;
		const repiteemail = group.get('repiteemail')?.value;
		return ((email !== repiteemail) ? { 'checkemails': true } : null);
	}

	// Inicialización de datos
	ngOnInit(): void {
		// lo pido a BBDD
		this.activatedRoute.params.subscribe(async (params: any) => {
			if (params._id) {
				this.titleForm = "Actualizar usuario";
				this.textBottom = "Actualizar";
				const response = await this.userService.getUserById(params._id);
				if (response) {
					this.modelForm = new FormGroup(
						{
							idUsuario: new FormControl(response.idUsuario),
							nombre: new FormControl(response.nombre, [Validators.required, Validators.minLength(3)]),
							apellidos: new FormControl(response.apellidos, [Validators.required, Validators.minLength(3)]),
							email: new FormControl(response.email, [Validators.required, Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)]),
							repiteemail: new FormControl(response.email, [Validators.required, Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)]),
							password: new FormControl(response.password, [Validators.required, Validators.minLength(6)]),
							repitepass: new FormControl(response.password, [Validators.required, Validators.minLength(6)]),
							imagen: new FormControl(response.imagen, [Validators.required]),
						},
						[this.checkpasswords, this.checkemails]

					);

				}
				const rutaimagen = response.imagen ? `http://localhost:3000${response.imagen}` : null;
				this.imageURL = rutaimagen; // Asigna la URL de la imagen a la propiedad imageURL

			}

		});

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
			this.modelForm.hasError('checkpasswords') &&
			this.modelForm.get('repitepass')?.touched
		);
	}

	checkControlEmail(): boolean | undefined {
		return (
			this.modelForm.hasError('checkemails') &&
			this.modelForm.get('repiteemail')?.touched
		);
	}

	// Envío de datos
	async onClickGuardarBD() {

		console.log(this.modelForm.value);
		if (this.modelForm.valid) {
			if (this.modelForm.value.idUsuario) {
				const response = await this.userService.updateUser(this.modelForm.value)
				if (response) {
					Swal.fire({
						icon: 'success',
						title: 'Actualización correcta',
						text: 'El usuario ha sido actualizado correctamente',
					});
					this.router.navigate(['/home']);
				}
				else {
					Swal.fire({
						icon: 'error',
						title: 'Error',
						text: 'Se ha producido un error en la actualización del usuario. Por favor, inténtelo de nuevo.',
					});
				}

			}
			else {

				this.user.nombre = this.modelForm.value.nombre;
				this.user.apellidos = this.modelForm.value.apellidos;
				this.user.email = this.modelForm.value.email;
				this.user.password = this.modelForm.value.password;
				this.user.imagen = this.modelForm.value.imagen;

				try {
					console.log(this.user);
					const response = await this.userService.registertUser(this.user);
					console.log(response);
					if (response) {
						Swal.fire({
							icon: 'success',
							title: 'Registro correcto',
							text: 'Bienvenido!. Ya puedes iniciar sesión con tu usuario en DIVI',
						});
						this.router.navigate(['/home']);
					}
				} catch (error) {
					console.log(error)
					Swal.fire({
						icon: 'error',
						title: 'Error',
						text: 'Se ha producido un error en el registro. Por favor, inténtelo de nuevo.',
					});
				}
			}
		}
	}
}
