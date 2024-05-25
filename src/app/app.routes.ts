import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NuevoGrupoComponent } from './pages/nuevo-grupo/nuevo-grupo.component';

export const routes: Routes = [

	// { path: "", redirectTo: "home", pathMatch: "full" },
	{
		path: "",
		loadChildren: () => import("./auth/auth.routes").then(m => m.AUTH_ROUTES)

	},
	// { path: "home", component: HomeComponent },
	{ path: "newgroup", component: NuevoGrupoComponent },
	{ path: "updategroup/:id", component: NuevoGrupoComponent },
];
