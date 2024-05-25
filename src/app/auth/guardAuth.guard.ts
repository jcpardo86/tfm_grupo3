import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
	const token = localStorage.getItem('token');
	if (!token) {
		return false;
	} else {
		return true;
	}
};
