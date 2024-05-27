import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FormGroupComponent } from './pages/form-group/form-group.component';
import { GroupViewComponent } from './pages/group-view/group-view.component';
import { UserViewComponent } from './pages/user-view/user-view.component';
import { authGuard } from './auth/guardAuth.guard';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { NewuserComponent } from './pages/newuser/newuser.component';

export const routes: Routes = [


	// {
	// 	path: "",
	// 	loadChildren: () => import("./auth/auth.routes").then(m => m.AUTH_ROUTES)

	// },

	{ path: "", redirectTo: "home", pathMatch: "full" },
	{ path: "home", component: HomeComponent },
	{ path: "newuser", component: NewuserComponent },
	{ path: "group/:_id", component: GroupViewComponent, canActivate: [authGuard] },
	{ path: "user/:_id", component: UserViewComponent, canActivate: [authGuard] },
	{ path: "updategroup/:id", component: FormGroupComponent, canActivate: [authGuard] },
	{ path: "newgroup", component: FormGroupComponent, canActivate: [authGuard] },
	{ path: "**", component: PageNotFoundComponent }
];
