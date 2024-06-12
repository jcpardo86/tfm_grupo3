import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
//import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UploadsService } from '../../services/uploads.service';

@Component({
	selector: 'app-upload-button',
	standalone: true,
	imports: [RouterLink, RouterOutlet],
	templateUrl: './upload-button.component.html',
	styleUrls: ['./upload-button.component.css']
})
export class UploadButtonComponent {

	selectedFile: File | null = null;

	//LARA - Nuevo añadido
	uploadService = inject(UploadsService);

	activatedRoute = inject(ActivatedRoute);

	id: string = ''; // Inicialmente vacío

	tipo: string = 'usuario';

	constructor(private http: HttpClient, private router: Router) { }

	isImagenGrupo: boolean = false;

	ngOnInit() {
		this.activatedRoute.params.subscribe(async (params: any) => {
			if(params.id_group){
				this.isImagenGrupo = true;
				this.tipo = 'grupo'
			}
		})
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
			})
		}
	}

	async onSubmit(): Promise<void> {
		if (!this.selectedFile) {
			Swal.fire({
				icon: 'error',
				title: 'Por favor selecciona una imagen válida',
				confirmButtonColor: '#FE5F42',
			})
			return;
		}

		if(this.isImagenGrupo){
			this.activatedRoute.params.subscribe(async (params: any) => {
				this.id = params.id_group;
			});
		}else{
			this.activatedRoute.params.subscribe(async (params: any) => {
				this.id = params.id_user;
			});
		}
		

		//this.activatedRoute.params.subscribe(async (params: any) => {
		try {

			/*const currentUrl = this.router.url;
			const idUsuario = currentUrl.split('upload/')[2]; // saca el token de la URL
			console.log(`Current URL: ${currentUrl}`); // Debug URL
			console.log(`usuario id: ${idUsuario}`); // Debug token*/

			const formData = new FormData();

			console.log('File to upload:', this.selectedFile);
			console.log('User ID:', this.id);


			formData.append('imagen', this.selectedFile);
			if(this.isImagenGrupo){
				formData.append('idGrupo', this.id);
				console.log("idGrupo despues de append", this.id);
			}else{
				formData.append('idUsuario', this.id);
				console.log("idUsuario despues de append", this.id);
			}
			
			if(this.isImagenGrupo){
				console.log("EE")
				console.log(formData)
				const response = this.uploadService.updateImageGroup(formData);
				console.log('File successfully uploaded!', response);
				Swal.fire({
					icon: 'success',
					title: 'Imagen de grupo actualizada',
					confirmButtonColor: '#FE5F42',
				}).then(() => {
					//window.location.reload();
					//Añadido nuevo
					this.router.navigate([`/group/${this.id}`]);
				});
			}else{
				const response = this.uploadService.updateImageUser(formData);
				console.log('File successfully uploaded!', response);
				Swal.fire({
					icon: 'success',
					title: 'Imagen de usuario actualizada',
					confirmButtonColor: '#FE5F42',
				}).then(() => {
					//window.location.reload();
					//Añadido nuevo
					this.router.navigate(['/home']);
				});
			}
			
 			
			//
			/*const response = await firstValueFrom(this.http.post('http://localhost:3000/api/upload/userimage', formData));
			console.log('File successfully uploaded!', response);
			Swal.fire({
				icon: 'success',
				title: 'Imagen de usuario actualizada',
				confirmButtonColor: '#FE5F42',

			}).then(() => {
				window.location.reload();
			})*/

		} catch (error) {
			console.error('Error uploading file!', error);
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'Algo salió mal, la imagen de usuario no se actualizó',
				confirmButtonColor: '#FE5F42',
			})

		}
	}//)
}
//}
