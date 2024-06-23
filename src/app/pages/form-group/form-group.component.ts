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

	tipo: string = 'AÑADIR' //Variable para distinguir entre formulario de registro o actualización

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
				Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/),
			]),
			porcentaje: new FormControl('', [
				Validators.required,
				Validators.pattern(/^(?!0\.00$)(?!0*$)(?!100$)(?!100\.00$)(?!100\.0$)(?![1-9][0-9]{2,}\.?[0-9]*$)([1-9]?[0-9]?(?:\.[0-9]{1,2})?)$/),
			]),
		},  [])
	}

	async ngOnInit() {

		this.activedRoute.params.subscribe(async (params: any) => {

			if(params.id_group) {
				this.tipo = "ACTUALIZAR";
				this.id_group = params.id_group;
				try {
					// Solicitamos datos del grupo para mostrar en formulario
					const group = await this.groupService.getGroupById(this.id_group);
					if(group) {
						this.groupForm = new FormGroup({
							nombre: new FormControl(group.nombre, [Validators.required, Validators.minLength(3)]),
							descripcion: new FormControl(group.descripcion, [Validators.required, Validators.minLength(5)]),
							},[]);
						}
					// Solicitamos los datos de usuarios del grupo para mostrar en formulario
					const users = await this.groupService.getUsersByGroup(this.id_group);
					for(let user of users) {
						const response = await this.groupService.getUserGroup(user.idUsuario, this.id_group);
						this.arrUsers.push(user);
						this.arrPorcents.push(response[0].porcentaje);
					}

					//Mostramos imagen de grupo si existe, en su ausencia mostramos la imagen por defecto
					const rutaimagen = group.imagen ? `http://localhost:3000/groupimage/${group.imagen}` : null;
					this.imageURL = rutaimagen; // Asigna la URL de la imagen a la propiedad imageURL
				
				} catch(error) {
					Swal.fire({
						icon: 'error',
						title: 'Error',
						text: 'Se ha producido un error en la actualización. Por favor, inténtelo de nuevo más tarde.',
					});
					this.router.navigate(['/group']);
				}

			} else {
				try {
					//Solicitamos datos de usuario admin y generamos una alerta personalizada para que el usuario introduzca su porcentaje de gasto en el nuevo grupo
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

							//Almacenamos el %gasto introducido por el usuario en propiedad adminPorcent
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
							this.router.navigate(['/groups']);
						}
			  		});
					  
				} catch(error) {
					Swal.fire({
						icon: 'error',
						title: 'Error',
						text: 'Se ha producido un error en la actualización. Por favor, inténtelo de nuevo más tarde.',
					});
					this.router.navigate(['/group']);
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

	// Método para comprobar si ya se ha alcanzado el porcentaje del 100% con los miembros añadidos
	porcentcompleted() {
		return ((this.sumPorcent === 100) ? true : false);
	};

	checkControlUser(formControlName: string, validador: string): boolean | undefined {
		return this.userForm.get(formControlName)?.hasError(validador)  && this.userForm.get(formControlName)?.touched
	};

	checkControlGroup(formControlName: string, validador: string): boolean | undefined {
		return this.groupForm.get(formControlName)?.hasError(validador) && this.groupForm.get(formControlName)?.touched
	};

	// Método para insertar usuario en grupo si se cumplen todas las validaciones/comprobaciones previas
	async addUser() {

		this.emailDuplicated = false;
		this.emailRegistered = true;

		try {

			// Solicitamos usuario a partir de su email para comprobar si está registrado
			const user = await this.userService.getUserByEmail(this.userForm.value.email);
			
			if(user) {
				this.emailDuplicated = this.emailduplicated();
				this.porcentExceeded = this.porcentexceeded();

				// Si el usuario no ha sido ya añadido al grupo y el porcentaje indicado no excede el 100% del grupo, se añade al array arrUsers
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

			// Si el usuario ha sido añadido previamente o con su porcentaje excede el 100% del grupo o si el mail no está registrado en DIVI, no validamos y reseteamos formulario de usuario
			if((!this.emailDuplicated || !this.porcentExceeded || this.emailRegistered)) {
				setTimeout(() => {
					this.emailDuplicated = false;
					this.porcentExceeded = false;
					this.emailRegistered = true; 
					this.userForm.reset();
				}, 2600);
			}

		} catch(error) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'Se ha producido un error en el registro. Por favor, inténtelo de nuevo más tarde.',
			});
			this.router.navigate(['/group']);
		}
	}

	async saveGroup() {

		if (this.id_group) {

			// Solicitamos actualización de datos del grupo
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
					confirmButtonColor: "#FE5F42"
				});
				this.router.navigate(['/groups']);
			} catch(error) {
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'Se ha producido un error en la actualización. Por favor, inténtelo de nuevo más tarde.',
				});
			}

		} else {

			// Solicitamos registro de datos de nuevo grupo
			this.newGroup.nombre = this.groupForm.value.nombre;
			this.newGroup.descripcion = this.groupForm.value.descripcion;

			try {
				const response = await this.groupService.insertGroup(this.newGroup);
				const id_group = response.insertId;

				this.arrUsers.push(this.adminUser);

				//Solicitamos registro de usuarios en el nuevo grupo
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
					confirmButtonColor: "#FE5F42"
				});
				this.router.navigate([`/group`, id_group]);
				
			} catch (error) {
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'Se ha producido un error la creación del grupo. Por favor, inténtelo de nuevo más tarde.',
				});
				this.router.navigate(['/group']);
			}
		}
	}

	getFile($event: any) {
		this.file = $event;
	};

	// Método para subir imagen de grupo
	async uploadImage (idGrupo: number) {
		const formData = new FormData();
		formData.append('imagen', this.file);
		formData.append('idGrupo', String(idGrupo));
		const response_2 = await this.uploadService.updateImageGroup(formData);
	};
	
}

