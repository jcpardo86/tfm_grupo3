import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-upload-button',
	standalone: true,
	imports: [RouterLink, RouterOutlet],
	templateUrl: './upload-button.component.html',
	styleUrls: ['./upload-button.component.css']
})
export class UploadButtonComponent {
	selectedFile: File | null = null;



	userId: string = ''; // Inicialmente vacío

	constructor(private http: HttpClient, private router: Router) { }



	onFileSelected(event: any): void {
		const file: File = event.target.files[0];
		if (file && file.type === 'image/jpeg') {
			this.selectedFile = file;
		} else {
			alert('Please select a JPG file.');
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



		try {
			const currentUrl = this.router.url;
			const idUsuario = currentUrl.split('/')[2]; // saca el token de la URL
			console.log(`Current URL: ${currentUrl}`); // Debug URL
			console.log(`usuario id: ${idUsuario}`); // Debug token

			const formData = new FormData();

			console.log('File to upload:', this.selectedFile);
			console.log('User ID:', idUsuario);


			formData.append('imagen', this.selectedFile);
			formData.append('idUsuario', idUsuario);

			console.log("idUsuario despues de append", idUsuario);


			const response = await firstValueFrom(this.http.post('http://localhost:3000/api/upload/userimage', formData));
			console.log('File successfully uploaded!', response);
			Swal.fire({
				icon: 'success',
				title: 'Imagen de usuario actualizada',
				confirmButtonColor: '#FE5F42',

			})

		} catch (error) {
			console.error('Error uploading file!', error);
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: 'Algo salió mal, la imagen de usuario no se actualizó',
				confirmButtonColor: '#FE5F42',
			})

		}
	}
}
