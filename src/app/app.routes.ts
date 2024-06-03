import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FormGroupComponent } from './pages/form-group/form-group.component';
import { GroupViewComponent } from './pages/group-view/group-view.component';
import { UserViewComponent } from './pages/user-view/user-view.component';
import { NewuserComponent } from './pages/newuser/newuser.component';
import { authGuard } from './auth/guardAuth.guard';
import { SpentViewComponent } from './pages/spent-view/spent-view.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ResetComponent } from './pages/reset/reset.component';

export const routes: Routes = [


	// {
	// 	path: "",
	// 	loadChildren: () => import("./auth/auth.routes").then(m => m.AUTH_ROUTES)

	// },

	{ path: "", redirectTo: "home", pathMatch: "full" },
	{ path: "home", component: HomeComponent },
	{ path: "resetpassword", component: ResetComponent },
	{ path: "newgroup", component: FormGroupComponent, canActivate: [authGuard] },
	{ path: "updategroup/:id", component: FormGroupComponent, canActivate: [authGuard] },
	{ path: "user", component: UserViewComponent, canActivate: [authGuard] },
	{ path: "group/:_id", component: GroupViewComponent, canActivate: [authGuard] },
	{ path: "newuser", component: NewuserComponent },
	{ path: "newspent/:id_group", component: SpentViewComponent, canActivate: [authGuard] },
	{ path: "updatespent/:id_spent", component: SpentViewComponent, canActivate: [authGuard] },
	{ path: "updateuser/:_id", component: NewuserComponent, canActivate: [authGuard] },
	{ path: "**", component: PageNotFoundComponent }
];
