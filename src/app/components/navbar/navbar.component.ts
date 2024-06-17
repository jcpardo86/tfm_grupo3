import { Component, inject } from '@angular/core';
import { Router, RouterLink} from '@angular/router';

import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  // Inyecta el servicio Router para gestionar la navegación y manipulación de rutas dentro de la aplicación.
  router = inject(Router);

  // Inyecta el servicio UsersService para gestión de usuarios
  userService = inject(UsersService);
  
  image: string = ""; //Propiedad para almacenar la imagen de usuario obtenida de BBDD
  id_user!: number; //Propiedad para almacenar el id de usuario logado

  //Método para verificar si hay un token de usuario almacenado en el localStorage. Si existe, devuelve el token; si no, devuelve false. Este método se usa para determinar si un usuario está logueado.
  isUserLoged() {
    return localStorage.getItem('token') || false;
  }

  //Método para borrar todos los datos almacenados en el localStorage, cerrando así la sesión del usuario. Luego, usa el servicio Router para navegar a la ruta /home, redirigiendo al usuario a la página de inicio.
  closeSession() {
    localStorage.clear();
    this.router.navigate([`/home`]);
  }

  async ngOnInit() {

    //Solicitamos la imagen de usuario del servidor y almacenamos la ruta en propiedad image
    try {
        this.id_user = parseInt(localStorage.getItem('idUserLogueado') || '');
        const response = await this.userService.getImageUser(this.id_user);

        if(response[0]!==undefined) {
          this.image = (`http://localhost:3000/userimage/${response[0].imagen}`)
        }
    } catch(error) {
      console.log(error);
    }
  }
}


