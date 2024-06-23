import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import Swal from 'sweetalert2';

import { IDebt } from '../../interfaces/idebt.interface';
import { SpentsService } from '../../services/spents.service';
import { DebtsService } from '../../services/debts.service';

@Component({
  selector: 'app-pay-button',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './pay-button.component.html',
  styleUrl: './pay-button.component.css'
})
export class PayButtonComponent {

  @Input() miDeuda!: IDebt; //Input para obtener los datos de la deuda del componente GroupView
  @Output() deudaPagada: EventEmitter<IDebt> = new EventEmitter(); //Output para emitir los datos de la deuda pagada al componente GroupView

  // Inyección de servicios SpentsService y DebtsService para gestión de gastos y deudas
  spentService = inject(SpentsService);
  debtService = inject(DebtsService);


  // Método para actualizar el importe que ha sido liquidado por el usuario y el estado de la deuda
  async payDebt() {

    try {
      const respuesta_1 = await this.spentService.updateLiquidado(this.miDeuda);
      const respuesta_2 = await this.debtService.updateStatus(this.miDeuda);

      //Mostramos mensaje a usuario informando de que el pago ha sido realizado
      Swal.fire({
        title: "Pago realizado!",
        text: "La deuda ha quedado saldada!",
        icon: "success",
        showCancelButton: false,
        confirmButtonColor: "#FE5F42",
        cancelButtonColor: "#d33",
        confirmButtonText: "ok"
      
      }).then((result) => {
        if (result.isConfirmed) {
        //Emitimos la deuda pagada para que el componente GroupView disponga de los datos
        this.deudaPagada.emit();
        }
      }); 
    } catch(error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Lo sentimos. Se ha producido al realizar el pago. Por favor, inténtelo de nuevo más tarde.',
        confirmButtonColor: '#FE5F42',
      });
    }
  }
}
