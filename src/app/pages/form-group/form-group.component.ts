import { Component, inject, numberAttribute } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';

import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { UploadButtonComponent } from '../../components/upload-button/upload-button.component';
import { IUser } from '../../interfaces/iuser.interface';
import { IGroup } from '../../interfaces/igroup.interface';
import { IGroupUser } from '../../interfaces/igroup-user.interface';
import { UsersService } from '../../services/users.service';
import { GroupsService } from '../../services/groups.service';
import { UploadsService } from '../../services/uploads.service';

@Component({
	selector: 'app-form-group',
	standalone: true,
	imports: [FooterComponent, ReactiveFormsModule, FormsModule, NavbarComponent, UploadButtonComponent],
	templateUrl: './form-group.component.html',
	styleUrls: ['./form-group.component.css']
})

export class FormGroupComponent {

	//Inyección de servicios UsersServie y GroupsService para gestión de usuarios, grupos e imagenes
	userService = inject(UsersService);
	groupService = inject(GroupsService);
	uploadService = inject(UploadsService);

	//Inyección de Router para redirección
	router = inject(Router);

	//Inyección de ActivatedRoute para obtener params de ruta
	activedRoute = inject(ActivatedRoute);

	tipo: string = 'AÑADIR'

	adminUser: IUser = {
		nombre : "",
		apellidos: "",
		email: "",
		password: ""
	};

	adminPorcent!: Number; 

	newGroupUser: IGroupUser = {
		idGrupo: 0,
		idUsuario: 0,
		porcentaje: 0,
		rol: "",
	};

	newGroup: IGroup = {
		nombre : "",
		descripcion: ""
	}

	id_group!: number;

	arrUsers : IUser[] = [];
	arrPorcents : Number[] = []

	userForm : FormGroup;
	groupForm : FormGroup;

	emailRegistered: boolean = true;
	emailDuplicated: boolean = false;

	porcentExceeded: boolean = false;
	porcentCompleted: boolean = false;
	sumPorcent: number = 0; 

	file!: File;
	imageURL: string | null = null;

	constructor() {

		//Datos del grupo (nombre y descripción)
		this.groupForm = new FormGroup({
			idGroup: new FormControl(0, []),
			nombre: new FormControl('', [
				Validators.required,
				Validators.minLength(3),
				Validators.required
			]),
			descripcion: new FormControl('', [
				Validators.required,
				Validators.minLength(5),
			])
			}, [])

		//Miembros invitados (email y porcentaje)
		this.userForm = new FormGroup({
			email: new FormControl('', [
				Validators.required,
				Validators.email,
				//this.emailDuplicated
			]),
			porcentaje: new FormControl('', [
				Validators.required,
				Validators.pattern(/^(?!0\.00$)(?!0*$)(?!100$)(?!100\.00$)(?!100\.0$)(?![1-9][0-9]{2,}\.?[0-9]*$)([1-9]?[0-9]?(?:\.[0-9]{1,2})?)$/),
				//this.totalPorcent
			]),
		},  [/*this.emailregistered*/])
	}

	async ngOnInit() {

		this.activedRoute.params.subscribe(async (params: any) => {

			if(params.id_group) {
				this.tipo = "ACTUALIZAR";
				this.id_group = params.id_group;
				try {
					const group = await this.groupService.getGroupById(this.id_group);
					if(group) {
						this.groupForm = new FormGroup({
							nombre: new FormControl(group.nombre, [Validators.required, Validators.minLength(3)]),
							descripcion: new FormControl(group.descripcion, [Validators.required, Validators.minLength(5)]),
							},[]);
						}
					const users = await this.groupService.getUsersByGroup(this.id_group);
					for(let user of users) {
						const response = await this.groupService.getUserGroup(user.idUsuario, this.id_group);
						this.arrUsers.push(user);
						this.arrPorcents.push(response[0].porcentaje);
					}

					const rutaimagen = group.imagen ? `http://localhost:3000/groupimage/${group.imagen}` : null;
					this.imageURL = rutaimagen; // Asigna la URL de la imagen a la propiedad imageURL
				
				} catch(error) {
					console.log(error);

				}

			} else {
				try {
					const id_admin = Number(localStorage.getItem('idUserLogueado'));
					this.adminUser = await this.userService.getUserById(id_admin);
					Swal.fire({
						title: `Hola ${this.adminUser.nombre}!`,
						text: `Por favor, introduce tu porcentaje de gasto como miembro del grupo:`,
						input: "text",
						inputPlaceholder: `Introduce porcentaje....`,
						inputAttributes: {
				  		autocapitalize: "off"
						},
						showCancelButton: true,
						cancelButtonColor: "#716add",
						cancelButtonText: "Cancelar",
						confirmButtonText: "Guardar",
						confirmButtonColor: "#FE5F42",
						showLoaderOnConfirm: true,
						preConfirm: (login) => {
							const porcentPattern = /^(?!0\.00$)(?!0*$)(?!100$)(?!100\.00$)(?!100\.0$)(?![1-9][0-9]{2,}\.?[0-9]*$)([1-9]?[0-9]?(?:\.[0-9]{1,2})?)$/;

							if (porcentPattern.test(login)) {
								this.adminPorcent = Number(login);
							} else {
								return Swal.showValidationMessage('El porcentaje introducido deber un valor entre 0.01 y 100.00');
							}
						},
						allowOutsideClick: () => !Swal.isLoading()
			  		}).then((result) => {
						if (result.isConfirmed) {
							this.sumPorcent = numberAttribute(this.adminPorcent);
							Swal.fire({
								title: "Gracias!",
								text: "A continuación, deberá informar los datos del grupo y añadir al resto de miembros.",
								confirmButtonColor: "#FE5F42"
							});
						}
						else {
							this.router.navigate(['/home']);
						}
			  		});
					  
				} catch (error) {
					console.log(error);
				}
			}
		});
	}

	// Método para validar si el email ya ha sido incluido en el listado de miembros del grupo
	emailduplicated () {	
		const email = this.userForm.value.email;
		return ( ((this.arrUsers.find(user => user.email === email)) || this.adminUser.email === email) ? true : false);
	};

	// Método para validar si el porcentaje del grupo excede el 100%
	porcentexceeded() {	
		const contador = Number(this.sumPorcent) + Number(this.userForm.value.porcentaje);
		return ( (contador > 100) ? true : false );
	};

	porcentcompleted() {
		return ((this.sumPorcent === 100) ? true : false);
	};

	checkControlUser(formControlName: string, validador: string): boolean | undefined {
		return this.userForm.get(formControlName)?.hasError(validador)  && this.userForm.get(formControlName)?.touched
	};

	checkControlGroup(formControlName: string, validador: string): boolean | undefined {
		return this.groupForm.get(formControlName)?.hasError(validador) && this.groupForm.get(formControlName)?.touched
	};

	async addUser() {

		this.emailDuplicated = false;
		this.emailRegistered = true;

		try {
			const user = await this.userService.getUserByEmail(this.userForm.value.email);
			
			if(user) {
				this.emailDuplicated = this.emailduplicated();
				this.porcentExceeded = this.porcentexceeded();

				if(!(this.emailDuplicated || this.porcentExceeded)) {
					this.arrUsers.push(user);
					this.arrPorcents.push(this.userForm.value.porcentaje);
					this.sumPorcent += Number(this.userForm.value.porcentaje);
					this.porcentCompleted = this.porcentcompleted();
					this.userForm.reset();
				}
			} else {
				this.emailRegistered = false;
			}

			if((!this.emailDuplicated || !this.porcentExceeded || this.emailRegistered)) {
				setTimeout(() => {
					this.emailDuplicated = false;
					this.porcentExceeded = false;
					this.emailRegistered = true; 
					this.userForm.reset();
				}, 2600);
			}

		} catch(error) {
			console.log(error);
		}
	}

	async saveGroup() {

		if (this.id_group) {
			
			try {
				this.newGroup.idGrupo = this.id_group;
				this.newGroup.nombre = this.groupForm.value.nombre;
				this.newGroup.descripcion = this.groupForm.value.descripcion;

				const response = await this.groupService.updateGroup(this.newGroup);
				if(this.file) {
					this.uploadImage(this.id_group);
				}
				Swal.fire({
					icon: 'success',
					text: 'Su información de grupo se ha actualizado correctamente',
				});
				this.router.navigate([`/groups`]);
			} catch(error) {
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'Se ha producido un error en la actualización. Por favor, inténtelo de nuevo más tarde.',
				});
			}

		} else {
			this.newGroup.nombre = this.groupForm.value.nombre;
			this.newGroup.descripcion = this.groupForm.value.descripcion;

			try {
				const response = await this.groupService.insertGroup(this.newGroup);
				const id_group = response.insertId;

				this.arrUsers.push(this.adminUser);

				for(let i in this.arrUsers) {
					this.newGroupUser.idUsuario = Number(this.arrUsers[i].idUsuario);
					this.newGroupUser.idGrupo = id_group;
					this.newGroupUser.porcentaje = Number(this.arrPorcents[i]);
					this.newGroupUser.rol = "guest";
					if(this.arrUsers[i].idUsuario===this.adminUser.idUsuario) {
						this.newGroupUser.porcentaje = Number(this.adminPorcent);
						this.newGroupUser.rol = "admin";
					}
					const response = await this.groupService.insertUserToGroup(this.newGroupUser);
				}
			
				if(this.file && id_group) {
					this.uploadImage(id_group);
				}
				Swal.fire({
					icon: 'success',
					text: 'El grupo ha sido creado correctamente',
				});
				this.router.navigate([`/group`, id_group]);
			} catch (error) {
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'Se ha producido un error la creación del grupo. Por favor, inténtelo de nuevo más tarde.',
				});
			}
		}
	}

	getFile($event: any) {
		this.file = $event;
		console.log('estoy en funcion', $event);
	};

	async uploadImage (idGrupo: number) {
		const formData = new FormData();
		formData.append('imagen', this.file);
		formData.append('idGrupo', String(idGrupo));
		const response_2 = await this.uploadService.updateImageGroup(formData);
	};
	
}

