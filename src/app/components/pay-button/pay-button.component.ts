import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IDebt } from '../../interfaces/idebt.interface';
import { SpentsService } from '../../services/spents.service';
import Swal from 'sweetalert2';
import { DebtsService } from '../../services/debts.service';

@Component({
  selector: 'app-pay-button',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './pay-button.component.html',
  styleUrl: './pay-button.component.css'
})
export class PayButtonComponent {

  @Input() miDeuda!: IDebt;
  @Output() deudaPagada: EventEmitter<IDebt> = new EventEmitter();

  //spentService = inject(SpentsService);
  debtService = inject(DebtsService);


  async getData() {
    // Tengo que crear un servicio para actualizar el campo importe_liquidado de tabla grupo_usuario
    //const respuesta = await this.spentService.updateLiquidado(this.miDeuda);
    //const respuesta_1 = await this.spentService.updateLiquidado(this.miDeuda);

    const respuesta = await this.debtService.updateStatus(this.miDeuda);
    console.log(respuesta);

    Swal.fire({
      title: "Pago realizado!",
      text: "La deuda ha quedado saldada!",
      icon: "success",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ok"
    }).then((result) => {
      if (result.isConfirmed) {
       location.reload();
      }
    });

    
    
  }

}
