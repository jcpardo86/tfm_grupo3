import { Component, Input } from '@angular/core';
import { IGroupUser } from '../../interfaces/igroup-user.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-group-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './group-card.component.html',
  styleUrl: './group-card.component.css'
})
export class GroupCardComponent {

  @Input() myGroup!: IGroupUser;

}
