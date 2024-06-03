import { Component, inject } from '@angular/core';
import { Router} from '@angular/router';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {


  router = inject(Router)

  //Este método verifica si hay un token de usuario almacenado en el localStorage. Si existe, devuelve el token; si no, devuelve false. Este método se usa para determinar si un usuario está logueado.
  isUserLoged() {
    return localStorage.getItem('token') || false;
  }
  //Este método borra todos los datos almacenados en el localStorage, efectivamente cerrando la sesión del usuario. Luego, usa el servicio Router para navegar a la ruta /home, redirigiendo al usuario a la página de inicio.
  closeSession() {
    localStorage.clear();
    this.router.navigate([`/home`]);
  }
}
