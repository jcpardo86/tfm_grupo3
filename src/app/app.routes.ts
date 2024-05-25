import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NuevoGrupoComponent } from './pages/nuevo-grupo/nuevo-grupo.component';
import { GroupViewComponent } from './pages/group-view/group-view.component';
import { UserViewComponent } from './pages/user-view/user-view.component';
import { authGuard } from './auth/guardAuth.guard';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

export const routes: Routes = [


	// {
	// 	path: "",
	// 	loadChildren: () => import("./auth/auth.routes").then(m => m.AUTH_ROUTES)

	// },
	{ path: "home", component: HomeComponent },
	{ path: "newgroup", component: NuevoGrupoComponent, canActivate: [authGuard] },
	{ path: "updategroup/:id", component: NuevoGrupoComponent, canActivate: [authGuard] },
	{ path: "user/:_id", component: UserViewComponent, canActivate: [authGuard] },
	{ path: "group/:_id", component: GroupViewComponent, canActivate: [authGuard] },
	{ path: "**", component: PageNotFoundComponent }

];
