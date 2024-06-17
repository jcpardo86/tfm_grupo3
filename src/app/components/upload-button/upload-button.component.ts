import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

import Swal from 'sweetalert2';

import { UploadsService } from '../../services/uploads.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
	selector: 'app-upload-button',
	standalone: true,
	imports: [RouterLink, RouterOutlet, NgIf, NavbarComponent],
	templateUrl: './upload-button.component.html',
	styleUrls: ['./upload-button.component.css']
})
export class UploadButtonComponent {

	selectedFile: File | null = null; //Propiedad para almacenar el fichero seleccionado
	id: string = ''; 
	tipo: string = 'usuario'; // 2 opciones para tipo; 'usuario' (subida de foto de usuario) o 'grupo' (subida de foto de grupo)
	isImagenGrupo: boolean = false;

	constructor(
		private http: HttpClient,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private uploadService: UploadsService
	) { }

	ngOnInit(): void {
		//Determinamos si se trata de la subida de una foto de usuario o una foto de grupo
		this.activatedRoute.params.subscribe((params: any) => {
			if (params.id_group) {
				this.isImagenGrupo = true;
				this.tipo = 'grupo';
				this.id = params.id_group;
			} else if (params.id_user) {
				this.id = params.id_user;
			}
		});
	}

	//Método para validar y almacenar en propiedad selectedFile la imagen introducida por el usuario
	onFileSelected(event: any): void {
		const file: File = event.target.files[0];
		if (file && file.type === 'image/jpeg') {
			this.selectedFile = file;
		} else {
			Swal.fire({
				icon: 'error',
				title: 'Por favor, selecciona una imagen .jpg',
				confirmButtonColor: '#FE5F42',
			});
		}
	}

	async onSubmit(): Promise<void> {
		if (!this.selectedFile) {
			Swal.fire({
				icon: 'error',
				title: 'Por favor, selecciona una imagen válida',
				confirmButtonColor: '#FE5F42',
			});
			return;
		}
		// Si el usuario ha seleccionado una imagen válida, se crea FormData y se añade la imagen
		const formData = new FormData();
		formData.append('imagen', this.selectedFile);

		// Actualización y subida de imagen (grupo o usuario)
		if (this.isImagenGrupo) {
			formData.append('idGrupo', this.id);
			try {
				const response = await this.uploadService.updateImageGroup(formData);
				console.log('File successfully uploaded!', response);
				Swal.fire({
					icon: 'success',
					title: 'Imagen de grupo actualizada',
					confirmButtonColor: '#FE5F42',
				}).then(() => {
					this.router.navigate([`/group/${this.id}`]);
				});
			} catch (error) {
				console.error('Error uploading file!', error);
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'Algo salió mal, la imagen de grupo no se actualizó',
					confirmButtonColor: '#FE5F42',
				});
			}
		} else {
			formData.append('idUsuario', this.id);
			try {
				const response = await this.uploadService.updateImageUser(formData);
				console.log('File successfully uploaded!', response);
				Swal.fire({
					icon: 'success',
					title: 'Imagen de usuario actualizada',
					confirmButtonColor: '#FE5F42',
				}).then(() => {
					this.router.navigate(['/home']);
				});
			} catch (error) {
				console.error('Error uploading file!', error);
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: 'Algo salió mal, la imagen de usuario no se actualizó',
					confirmButtonColor: '#FE5F42',
				});
			}
		}
	}

	//Método para vista previa de imagen
	getImageUrl(file: File): string {
		return URL.createObjectURL(file);
	}
}
