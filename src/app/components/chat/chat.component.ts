import { Component, inject } from '@angular/core';

import { ChatService } from '../../services/chat.service';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

  userChat = {
    usuario: 2,
    texto: '',
    grupo: 2,
  }

  chatService = inject(ChatService);

  myMessages=[{
    usuario: 2,
    texto: '',
    grupo: 2,
  }];

  eventName = "send-message";



 ngOnInit(): void {

  

    this.chatService.listen('text-event').subscribe((data : any) => {
      console.log(data);
      this.myMessages = data;
      console.log(this.myMessages);
    })
 }

 getDataForm(chatFormulario: any) {
  console.log (chatFormulario.value.input);
  this.userChat.texto = chatFormulario.value.input;
  this.chatService.emit(this.eventName, this.userChat);
  chatFormulario.reset(); 
 }
  
}

