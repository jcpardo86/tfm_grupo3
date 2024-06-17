import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FormGroupComponent } from './pages/form-group/form-group.component';
import { GroupViewComponent } from './pages/group-view/group-view.component';
import { authGuard } from './auth/guardAuth.guard';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ResetComponent } from './pages/reset-password/reset.component';
import { NewPasswordPageComponent } from './pages/new-password-page/new-password-page.component';
import { GroupListComponent } from './pages/group-list/group-list.component';
import { FormSpentComponent } from './pages/form-spent/form-spent.component';
import { FormUserComponent } from './pages/form-user/form-user.component';
import { UploadButtonComponent } from './components/upload-button/upload-button.component';


//Definición de rutas que componen la aplicación:

export const routes: Routes = [

	{ path: "", redirectTo: "home", pathMatch: "full" },

	// Ruta a página de inicio: Home
	{ path: "home", component: HomeComponent },
	
	// Ruta a página que muestra el listado de grupos al que pertenece el usuario logado
	{ path: "groups", component: GroupListComponent, canActivate: [authGuard] },

	// Ruta a página que muestra toda la información de un grupo (descripción, miembros, listado de gastos, listado de deudas) y chat
	{ path: "group/:_id", component: GroupViewComponent, canActivate: [authGuard] },

	// Rutas para formularios de creación y edición de grupo
	{ path: "newgroup", component: FormGroupComponent, canActivate: [authGuard] },
	{ path: "updategroup/:id", component: FormGroupComponent, canActivate: [authGuard] },
	{ path: "updategroup/upload/:id_group", component: UploadButtonComponent, canActivate: [authGuard] },
	
	// Rutas para formularios de creación y edición de usuarios
	{ path: "newuser", component: FormUserComponent },
	{ path: "newuser/upload/:id_user", component: UploadButtonComponent },
	{ path: "updateuser/:id_user", component: FormUserComponent, canActivate: [authGuard] },
	{ path: "updateuser/upload/:id_user", component: UploadButtonComponent, canActivate: [authGuard] },

	// Rutas para reset de password (si usuario ha olvidado su password)
	{ path: "resetpassword", component: ResetComponent },
	{ path: "reset/:token", component: NewPasswordPageComponent },

	// Rutas para formularios de creación y edición de gastos en un grupo
	{ path: "newspent/:id_group", component: FormSpentComponent, canActivate: [authGuard] },
	{ path: "updatespent/:id_spent", component: FormSpentComponent, canActivate: [authGuard] },

	// Ruta a página Error 404
	{ path: "**", component: PageNotFoundComponent }
];
