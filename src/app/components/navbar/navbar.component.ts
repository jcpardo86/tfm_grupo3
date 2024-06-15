import { Component, inject } from '@angular/core';
import { Router, RouterLink} from '@angular/router';
import { UsersService } from '../../services/users.service';
import { IUser } from '../../interfaces/iuser.interface';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {


  router = inject(Router);
  userService = inject(UsersService);
  
  image: string = "";

  id_user = parseInt(localStorage.getItem('idUserLogueado') || '');

  //Este método verifica si hay un token de usuario almacenado en el localStorage. Si existe, devuelve el token; si no, devuelve false. Este método se usa para determinar si un usuario está logueado.
  isUserLoged() {
    return localStorage.getItem('token') || false;
  }
  //Este método borra todos los datos almacenados en el localStorage, efectivamente cerrando la sesión del usuario. Luego, usa el servicio Router para navegar a la ruta /home, redirigiendo al usuario a la página de inicio.
  closeSession() {
    localStorage.clear();
    this.router.navigate([`/home`]);
  }

  async ngOnInit() {
    try {
        const response = await this.userService.getImageUser(this.id_user);

        if(response[0]!==undefined) {
          this.image = (`http://localhost:3000/userimage/${response[0].imagen}`)
        }
    } catch(error) {
      console.log(error);
    }
  }
}


