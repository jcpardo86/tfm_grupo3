import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
//import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UploadsService } from '../../services/uploads.service';
import { NgIf } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
	selector: 'app-upload-button',
	standalone: true,
	imports: [RouterLink, RouterOutlet, NgIf, NavbarComponent],
	templateUrl: './upload-button.component.html',
	styleUrls: ['./upload-button.component.css']
})
export class UploadButtonComponent {

	selectedFile: File | null = null;
	id: string = '';
	tipo: string = 'usuario';
	isImagenGrupo: boolean = false;

	constructor(
		private http: HttpClient,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private uploadService: UploadsService
	) { }

	ngOnInit(): void {
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

	onFileSelected(event: any): void {
		const file: File = event.target.files[0];
		if (file && file.type === 'image/jpeg') {
			this.selectedFile = file;
		} else {
			Swal.fire({
				icon: 'error',
				title: 'Por favor selecciona una imagen .jpg',
				confirmButtonColor: '#FE5F42',
			});
		}
	}

	async onSubmit(): Promise<void> {
		if (!this.selectedFile) {
			Swal.fire({
				icon: 'error',
				title: 'Por favor selecciona una imagen válida',
				confirmButtonColor: '#FE5F42',
			});
			return;
		}

		const formData = new FormData();
		formData.append('imagen', this.selectedFile);

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

	getImageUrl(file: File): string {
		return URL.createObjectURL(file);
	}
}
