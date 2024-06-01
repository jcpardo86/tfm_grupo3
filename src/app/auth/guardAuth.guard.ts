import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Swal from 'sweetalert2';

export const authGuard: CanActivateFn = (route, state) => {

	const router = inject (Router);

	const token = localStorage.getItem('token');

	if (!token) {
		Swal.fire({
			icon: "error",
			title: "Oops...",
			text: "Lo sentimos. Para acceder debes iniciar sesión!",
		  });
		router.navigateByUrl('/home');
		return false;
	} else {
		return true;
	}
};
