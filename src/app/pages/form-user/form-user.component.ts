import { Component, inject } from '@angular/core';
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
import { NgIf } from '@angular/common';
import { UploadsService } from '../../services/uploads.service';


@Component({
	selector: 'app-newuser',
	standalone: true,
	imports: [ReactiveFormsModule, RouterLink, NavbarComponent, UploadButtonComponent, NgIf],
	templateUrl: './form-user.component.html',
	styleUrls: ['./form-user.component.css'],
})
export class FormUserComponent {
	// Formulario de registro
	modelForm: FormGroup;

	// Inyección de servicios
	userService = inject(UsersService);
	uploadService = inject(UploadsService);

	// Variables
	titleForm: string = "Regístrate como nuevo usuario";
	textBottom: string = "Guardar";
	isUpdatingUser: boolean = false;
	activatedRoute = inject(ActivatedRoute);
	imageURL: string | null = null;

	file!: File;
	id_user!: number;

	// Interfaz de usuario
	user: IUser = {
		nombre: '',
		apellidos: '',
		email: '',
		password: '',
		imagen: '',
	};

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
				//imagen: new FormControl(null, [Validators.required]),
			},
			[this.checkpasswords, this.checkemails]
		);
	}



	// Verificación de contraseña
	checkpasswords(group: AbstractControl): any {
		const password = group.get('password')?.value;
		const repitepass = group.get('repitepass')?.value;
		return ((password !== repitepass) ? { 'checkpasswords': true } : null);
	}

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

			if (params.id_user) {
				this.isUpdatingUser = true;
				this.titleForm = "Actualiza tus datos de usuario";
				this.textBottom = "Actualizar";
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
							//imagen: new FormControl(response.imagen, [Validators.required]),
						},
						[this.checkpasswords, this.checkemails]

					);

				}
				const rutaimagen = response.imagen ? `http://localhost:3000/userimage/${response.imagen}` : null;
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
	
		if (this.modelForm.valid) {

			if (this.modelForm.value.idUsuario) {
			
				try {
					const response_1 = await this.userService.updateUser(this.modelForm.value);
					if(this.file) {
						this.uploadImage(this.modelForm.value.idUsuario);
					}
					Swal.fire({
						icon: 'success',
						text: 'Su información de usuario se ha actualizado correctamente',
					});
					this.router.navigate([`/home`]);
				} catch(error) {
					Swal.fire({
						icon: 'error',
						title: 'Error',
						text: 'Se ha producido un error en la actualización. Por favor, inténtelo de nuevo más tarde.',
					});
				}

			} else {
				this.user.nombre = this.modelForm.value.nombre;
				this.user.apellidos = this.modelForm.value.apellidos;
				this.user.email = this.modelForm.value.email;
				this.user.password = this.modelForm.value.password;

				try {
					const response_1 = await this.userService.registerUser(this.user);
					const response_2 = await this.userService.getUserByEmail(this.modelForm.value.email);
					if(this.file && response_2.idUsuario) {
						this.uploadImage(response_2.idUsuario);
					}
					Swal.fire({
						icon: 'success',
						text: 'El registro de usuario se ha realizado correctamente',
					});
					this.router.navigate([`/home`]);
				} catch (error) {
					Swal.fire({
						icon: 'error',
						title: 'Error',
						text: 'Se ha producido un error en el registro. Por favor, inténtelo de nuevo más tarde.',
					});
				}
			}
		}
	}

	getFile($event: any) {
		this.file = $event;
		console.log('estoy en funcion', $event);
	};

	async uploadImage (idUsuario: number) {
		const formData = new FormData();
		formData.append('imagen', this.file);
		formData.append('idUsuario', String(idUsuario));
		const response_2 = await this.uploadService.updateImageUser(formData);
	};
}

