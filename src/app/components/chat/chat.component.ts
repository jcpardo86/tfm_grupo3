import { Component, Input, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, NgFor } from '@angular/common';

import { io } from 'socket.io-client';
import dayjs from 'dayjs';

import { MessagesService } from '../../services/messages.service';
import { UsersService } from '../../services/users.service';

import { IMessage } from '../../interfaces/imessage.interface';


@Component({
	selector: 'app-chat',
	standalone: true,
	imports: [ReactiveFormsModule, NgFor, DatePipe],
	templateUrl: './chat.component.html',
	styleUrl: './chat.component.css'
})
export class ChatComponent {

	socket = io('http://localhost:3000');

	@Input() id_group!: number; //Input para obtención del id de Grupo desde componente GroupView 

	//Inyección de servicios MessagesService y UsersServices para gestión de mensajes y usuarios
	messageService = inject(MessagesService);
	userService = inject(UsersService);

	arrMessages: IMessage[] = []; //Array para almacenar los mensajes del chat (históricos y nuevos)

	msg: IMessage = {  //Objeto para almacenar nuevo mensaje introducido por usuario
		idUsuario: 0,
		idGrupo: 0,
		fecha_hora: '',
		texto: ''
	};

	formChat: FormGroup; //Formulario para registro de nuevo mensaje de usuario

	constructor() {
		this.formChat = new FormGroup({
			message: new FormControl(),
		})
	}

	async ngOnInit() {

		//Extraemos el id del usuario logado de local storge
		this.msg.idUsuario = parseInt(localStorage.getItem('idUserLogueado') || '');

		//Solicitamos el listado de mensajes de un grupo almacenados en BBDD y los ordenamos por id.
		try {
			const messages = await this.messageService.getMessagesByGroup(this.id_group);
			messages.sort((a: any, b: any) => {
				return a.idMensaje - b.idMensaje;
			});

			//Añadimos a cada objeto mensaje el nombre de usuario que lo ha generado
			for (let i in messages) {
				const user = await this.userService.getUserById(messages[i].idUsuario);
				messages[i].nombre_usuario = user.nombre;
			}
			this.arrMessages = messages;

		} catch (error) {
			console.log(error);
		}

		//Recepcionamos cada mensaje difundido por el servidor y lo añadimos al array de mensajes
		this.socket.on('chat_message_server', async (message) => {
			const user = await this.userService.getUserById(message.idUsuario);
			message.nombre_usuario = user.nombre;
			this.arrMessages.push(message);
		});
	}

	//Método para obtener el nuevo mensaje que ha introducido el usuario en el form del chat y emitirlo al servidor
	getDataForm() {
		this.msg.texto = this.formChat.value.message;
		this.msg.idGrupo = this.id_group;
		this.msg.fecha_hora = dayjs(new Date()).format('YYYY-MM-DD HH:mm')
		this.socket.emit('chat_message_client', this.msg);
		this.formChat.reset();
	}

  	//Método para Scroll de chat
	async ngAfterContentChecked() {
		let ulChat = document.getElementById("chat-ul") || document.createElement('div');
		ulChat.scrollTop = ulChat.scrollHeight;
  	}

}


