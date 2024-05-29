import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

	const router = inject (Router);

	const token = localStorage.getItem('token');

	if (!token) {
		alert('Necesitas estar autenticado');
		router.navigateByUrl('/home');
		return false;
	} else {
		return true;
	}
};
