import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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

	//Output para enviar a componente formUser y groupUser el fichero de imagen
	@Output() file: EventEmitter<File> = new EventEmitter();
	
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
			this.file.emit(this.selectedFile);
		} else {
			Swal.fire({
				icon: 'error',
				title: 'Por favor, selecciona una imagen .jpg',
				confirmButtonColor: '#FE5F42',
			});
		}
	}

	//Método para vista previa de imagen
	getImageUrl(file: File): string {
		return URL.createObjectURL(file);
	}
}
