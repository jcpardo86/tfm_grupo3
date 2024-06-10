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


//TODO: Editar foto

export class FormGroupComponent {
	userService = inject(UsersService);
	groupService = inject(GroupsService);
	router = inject(Router);
	activedRoute = inject(ActivatedRoute)

	tipo: string = 'Añadir'

	modelForm: FormGroup;
	aniadirUsuarioForm: FormGroup;
	existeUsuario: boolean = true;
	buttonPulsed: boolean = false;
	isActualizar: boolean = false;
	arrUsuarios: IUser[];
	correctEmails: boolean = true;

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
				Validators.pattern("^100$|^([0-9]|[1-9][0-9])$")
			])
		},
			[])
	}

	ngOnInit() {
		this.activedRoute.params.subscribe(async (params: any) => {
			if (params.id) {
				this.idGrupoUpdate = params.id;
				this.isActualizar = true;
				this.tipo = 'Actualizar'
				const responseGroup = await this.groupService.getGroupById(params.id)
				this.modelForm = new FormGroup({
					nombreGrupo: new FormControl(responseGroup.nombre, [
						Validators.required,
						Validators.minLength(3),
						Validators.required
					]),
					descripcionGrupo: new FormControl(responseGroup.descripcion, [
						Validators.required,
						Validators.minLength(3),
					])
				},
					[])
				const response = await this.groupService.getUsersByGroup(responseGroup.idGrupo)
				response.forEach(async user => {
					const userGrupo = await this.groupService.getUserGroup(user.idUsuario, responseGroup.idGrupo)
					user.porcentaje = userGrupo.porcentaje;
				});
				this.arrUsuarios = response;
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
		})
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
				imagen: "prueba.png"
			};
			if (this.isActualizar) {
				const response = await this.groupService.updateGroup(formGroup);
				this.groupService.deleteGroupUsers(this.idGrupoUpdate);
				this.arrUsuarios.forEach(usuario => {
					let rol = 'GUEST';
					if (usuario.email == this.userLogueado.email) {
						rol = 'ADMIN';
					}
					const newGroupUser: IGroupUser = {
						idGrupo: this.idGrupoUpdate,
						idUsuario: (usuario.idUsuario !== undefined ? usuario.idUsuario : 0),
						porcentaje: (usuario.porcentaje !== undefined ? usuario.porcentaje : 0),
						rol: rol
					};
					this.groupService.insertUserToGroup(newGroupUser);
				});
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
				Swal.fire(`El grupo "${response.nombre}" ha sido creado correctamente`);
				this.router.navigate([`/group/${response.idGrupo}`]);
			}
		} else {
			this.setCorrectEmails(false);
		}
	}


	setCorrectEmails(value: boolean) {
		this.correctEmails = value;
	}

	limpiar() {
		this.arrUsuarios = [];
	}
}
