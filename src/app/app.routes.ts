import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NuevoGrupoComponent } from './pages/nuevo-grupo/nuevo-grupo.component';
import { GroupViewComponent } from './pages/group-view/group-view.component';
import { UserViewComponent } from './pages/user-view/user-view.component';

export const routes: Routes = [

	// { path: "", redirectTo: "home", pathMatch: "full" },
	{
		path: "",
		loadChildren: () => import("./auth/auth.routes").then(m => m.AUTH_ROUTES)

	},
	// { path: "home", component: HomeComponent },
	{ path: "newgroup", component: NuevoGrupoComponent },
	{ path: "updategroup/:id", component: NuevoGrupoComponent },
	{ path: "user/:_id", component: UserViewComponent },
	{ path: "group/:_id", component: GroupViewComponent },
];
