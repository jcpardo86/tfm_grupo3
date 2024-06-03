import { Component, inject } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

import { io } from 'socket.io-client';
import { MessagesService } from '../../services/messages.service';
import { IMessage } from '../../interfaces/imessage.interface';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

  

  socket = io('http://localhost:3000');

  msg = {
    idMensaje: 0,
    idUsuario: 13,
    idGrupo: 2,
    fecha_hora: '2024-05-18 20:14',
    texto: ''
  };

  myMessage = {
    idUsuario: 13,
    idGrupo: 2,
    fecha_hora: '2024-05-18 20:14',
    texto: ''
  };

  messageService = inject(MessagesService);

  previousMessages! : Array<IMessage>
  newMessages : Array<IMessage> = []

  formChat: FormGroup;

  constructor() {
    this.formChat = new FormGroup({
      message: new FormControl(),
    })
  }

 async ngOnInit() {

    try {
      const result = await this.messageService.getMessagesByGroup(2);
      this.previousMessages = result;
    } catch(error) {
      console.log(error);
    }

    this.socket.on('chat_message_server', (message) => {
      console.log(message);
      this.newMessages.push(message);
      console.log(this.newMessages);
    });
 }

 getDataForm() {
  this.msg.texto = this.formChat.value.message;
  this.socket.emit('chat_message_client', this.msg);
  this.formChat.reset(); 
 }

}


