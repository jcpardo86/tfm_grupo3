import { Component, Input, inject } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, NgFor } from '@angular/common';

import { io } from 'socket.io-client';
import { MessagesService } from '../../services/messages.service';
import { IMessage } from '../../interfaces/imessage.interface';
import dayjs from 'dayjs';
import { UsersService } from '../../services/users.service';

@Component({
	selector: 'app-chat',
	standalone: true,
	imports: [ReactiveFormsModule, NgFor, DatePipe],
	templateUrl: './chat.component.html',
	styleUrl: './chat.component.css'
})
export class ChatComponent {

	@Input() id_group!: number;

	socket = io('http://localhost:3000');

	messageService = inject(MessagesService);
	userService = inject(UsersService);

	arrMessages: IMessage[] = [];

	msg: IMessage = {
		idUsuario: 0,
		idGrupo: 0,
		fecha_hora: '',
		texto: ''
	};

	formChat: FormGroup;

	constructor() {
		this.formChat = new FormGroup({
			message: new FormControl(),
		})
	}

	async ngOnInit() {

		this.msg.idUsuario = parseInt(localStorage.getItem('idUserLogueado') || '');

		try {
			const messages = await this.messageService.getMessagesByGroup(this.id_group);

			messages.sort((a: any, b: any) => {
				return a.idMensaje - b.idMensaje;
			});

			for (let message of messages) {
				const user = await this.userService.getUserById(message.idUsuario);
				message.nombre_usuario = user.nombre;
			}
			this.arrMessages = messages;
		} catch (error) {
			console.log(error);
		}

		this.socket.on('chat_message_server', async (message) => {
			const user = await this.userService.getUserById(this.msg.idUsuario);
			message.nombre_usuario = user.nombre;
			this.arrMessages.push(message);
		});
	}

	getDataForm() {
		this.msg.texto = this.formChat.value.message;
		this.msg.idGrupo = this.id_group;
		this.msg.fecha_hora = dayjs(new Date()).format('YYYY-MM-DD HH:mm')
		console.log(this.msg);
		this.socket.emit('chat_message_client', this.msg);
		this.formChat.reset();
	}

}


