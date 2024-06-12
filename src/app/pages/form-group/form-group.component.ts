import { Component, inject } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUser } from '../../interfaces/iuser.interface';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IGroup } from '../../interfaces/igroup.interface';
import { GroupsService } from '../../services/groups.service';
import { IGroupUser } from '../../interfaces/igroup-user.interface';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import Swal from 'sweetalert2';
import { UploadButtonComponent } from '../../components/upload-button/upload-button.component';

@Component({
	selector: 'app-form-group',
	standalone: true,
	imports: [FooterComponent, ReactiveFormsModule, FormsModule, NavbarComponent, UploadButtonComponent],
	templateUrl: './form-group.component.html',
	styleUrls: ['./form-group.component.css']
})

export class FormGroupComponent {
	userService = inject(UsersService);
	groupService = inject(GroupsService);
	router = inject(Router);
	activedRoute = inject(ActivatedRoute)

	tipo: string = 'AÑADIR'

	modelForm: FormGroup;
	aniadirUsuarioForm: FormGroup;
	existeUsuario: boolean = true;
	buttonPulsed: boolean = false;
	isActualizar: boolean = false;
	arrUsuarios: IUser[];
	correctEmails: boolean = true;
	existsImage: boolean = false;

	newUser: IUser = {
		idUsuario: 0,
		nombre: "",
		apellidos: "",
		email: "",
		password: "",
		imagen: ""
	};

	userLogueado: IUser = {
		idUsuario: 0,
		nombre: "",
		apellidos: "",
		email: "",
		password: "",
		imagen: ""
	};

	idGrupoUpdate: number = 0;

	image: string = "";
	imageString: string = "";

	constructor() {
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
				Validators.pattern("^([1-9]|[1-9][0-9])$")
			])
		},
			[])
	}

	ngOnInit() {
		this.activedRoute.params.subscribe(async (params: any) => {
			if (params.id) {
				this.idGrupoUpdate = params.id;
				this.isActualizar = true;
				this.tipo = 'ACTUALIZAR';
	
				try {
					const responseGroup = await this.groupService.getGroupById(params.id);
					this.modelForm = new FormGroup({
						nombreGrupo: new FormControl(responseGroup.nombre, [
							Validators.required,
							Validators.minLength(3),
						]),
						descripcionGrupo: new FormControl(responseGroup.descripcion, [
							Validators.required,
							Validators.minLength(3),
						])
					});
	
					const response = await this.groupService.getUsersByGroup(responseGroup.idGrupo);
					for (const user of response) {
						const userGrupo = await this.groupService.getUserGroup(user.idUsuario, responseGroup.idGrupo);
						if (Array.isArray(userGrupo) && userGrupo.length > 0) {
							user.porcentaje = userGrupo[0].porcentaje;
						}
					}
					this.arrUsuarios = response;
				} catch (error) {
					console.error('Error fetching group data or users:', error);
				}
			}
		});
	
		this.loadGroupImage();
	}
	
	async loadGroupImage() {
		try {
			const response = await this.groupService.getImageGroup(this.idGrupoUpdate);
			if (Array.isArray(response) && response.length > 0) {
				if (response[0].imagen !== undefined && response[0].imagen != null && response[0].imagen.length > 0) {
					this.image = `http://localhost:3000/groupimage/${response[0].imagen}`;
					this.imageString = `${response[0].imagen}`;
				}else{
					this.image = 'assets/images/grupo.png';
				}
			}else {
				this.image = 'assets/images/grupo.png';
			}
			
		} catch (error) {
			console.error('Error fetching group image:', error);
		}
	}

	async aniadirUsuario() {
		if (!this.checkControlAniadir('email', 'required') && !this.checkControlAniadir('email', 'email') && !this.checkControlAniadir('porcentaje', 'required') && !this.checkControlAniadir('porcentaje', 'pattern')) {
			const email = this.aniadirUsuarioForm.value.email;
			try {
				const response = await this.userService.getUserByEmail(email);
				if (response !== null) {
					this.newUser = response;
					this.newUser.porcentaje = this.aniadirUsuarioForm.value.porcentaje;
					this.existeUsuario = true;
					if (!this.arrUsuarios.find(user => user.email === email)) {
						this.arrUsuarios.push(this.newUser);
						this.resetFormAniadir();
						const id = localStorage.getItem('idUserLogueado');
						try {
							const response = await this.userService.getUserById(Number(id));
							this.userLogueado = response;
						} catch (err) {
							console.log(err);
						}
						if (this.arrUsuarios.find(user => user.email === this.userLogueado.email))this.setCorrectEmails(true);
					}
					if (this.correctPorcentajes()) {
						this.buttonPulsed = false;
					}
				} else {
					this.existeUsuario = false;
				}
			} catch (err) {
				this.router.navigate(['/error']);
			}
		}

	}

	checkActualizar(): boolean {
		return this.isActualizar;
	}

	checkControlAniadir(formControlName: string, validador: string): boolean | undefined {
		return this.aniadirUsuarioForm.get(formControlName)?.hasError(validador) && this.aniadirUsuarioForm.get(formControlName)?.touched
	}

	checkControlGrupo(formControlName: string, validador: string): boolean | undefined {
		return this.modelForm.get(formControlName)?.hasError(validador) && this.modelForm.get(formControlName)?.touched
	}

	correctPorcentajes(): boolean {
		let sumaPorcentaje: number = 0;
		this.arrUsuarios.forEach(usuario => {
			if (usuario.porcentaje) sumaPorcentaje += Number(usuario.porcentaje);
		});
		if (sumaPorcentaje == 100) return true
		if (this.arrUsuarios.length == 0) return true;
		return false;
	}

	async crearGrupo() {
		if( this.correctPorcentajes()){
			const id = localStorage.getItem('idUserLogueado');
			try {
				const response = await this.userService.getUserById(Number(id));
				this.userLogueado = response;
			} catch (err) {
				console.log(err);
			}
			if (this.arrUsuarios.find(user => user.email === this.userLogueado.email)) {
				this.setCorrectEmails(true);
				const formGroup: IGroup = {
					idGrupo: this.idGrupoUpdate,
					nombre: this.modelForm.value.nombreGrupo,
					descripcion: this.modelForm.value.descripcionGrupo,
					imagen: this.imageString
				};
				if (this.isActualizar) {
					const response = await this.groupService.updateGroup(formGroup);
					this.uploadFoto(this.idGrupoUpdate);
				} else {
					const response = await this.groupService.insertGroup(formGroup);
					this.arrUsuarios.forEach(usuario => {
						let rol = 'GUEST';
						if (usuario.email == this.userLogueado.email) {
							rol = 'ADMIN';
						}
						const newGroupUser: IGroupUser = {
							idGrupo: (response.idGrupo !== undefined ? response.idGrupo : 0),
							idUsuario: (usuario.idUsuario !== undefined ? usuario.idUsuario : 0),
							porcentaje: (usuario.porcentaje !== undefined ? usuario.porcentaje : 0),
							rol: rol
						};
						this.groupService.insertUserToGroup(newGroupUser);
					});
					this.uploadFoto(response.idGrupo)
				}
			} else {
				this.setCorrectEmails(false);
			}
		}
	}

	setCorrectEmails(value: boolean) {
		this.correctEmails = value;
	}

	limpiar() {
		this.buttonPulsed = false;
		this.arrUsuarios = [];
	}

	resetFormAniadir(){
		this.aniadirUsuarioForm = new FormGroup({
			email: new FormControl('', [
				Validators.required,
				Validators.email
			]),
			porcentaje: new FormControl('', [
				Validators.required,
				Validators.pattern("^([1-9]|[1-9][0-9])$")
			])
		},
			[])
	}

	uploadFoto(idGrupoUpdate: number | undefined){		
		Swal.fire({
			title: "¿Desea subir una foto de grupo?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			cancelButtonText: "Cancelar",
			confirmButtonText: "Sí!"
		  }).then(async (result) => {
			if (result.isConfirmed) {
			  try {
				this.router.navigate([`/updategroup/upload/${idGrupoUpdate}`]); 
			  } catch(error) {
				alert('Se ha producido un error al subir la imagen del grupo. Por favor, inténtelo de nuevo más tarde.')
			  }
			
			} else {
				Swal.fire(`La operación se ha realizado correctamente`);
				this.router.navigate([`/group/${idGrupoUpdate}`]);
			}
		})
	}
}
