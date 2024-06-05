import { Component, Input, inject } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, NgFor } from '@angular/common';

import { io } from 'socket.io-client';
import { MessagesService } from '../../services/messages.service';
import { IMessage } from '../../interfaces/imessage.interface';
import dayjs from 'dayjs';

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

  arrMessages : IMessage[] = [];

  msg : IMessage = {
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

    try {
      const messages = await this.messageService.getMessagesByGroup(this.id_group);
      this.arrMessages = messages;
    } catch(error) {
      console.log(error);
    }

    this.socket.on('chat_message_server', (message) => {
      console.log(message);
      this.arrMessages.push(message);
      console.log(this.arrMessages);
    });
 }

 getDataForm() {
  this.msg.texto = this.formChat.value.message;
  this.msg.idUsuario = parseInt(localStorage.getItem('idUserLogueado') || '');
  this.msg.idGrupo = this.id_group;
  this.msg.fecha_hora = dayjs(new Date()).format('YYYY-MM-DD HH:mm')
  console.log(this.msg);
  this.socket.emit('chat_message_client', this.msg);
  this.formChat.reset(); 
 }

}


