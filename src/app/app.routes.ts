import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NuevoGrupoComponent } from './pages/nuevo-grupo/nuevo-grupo.component';
import { NewuserComponent } from './pages/newuser/newuser.component';

export const routes: Routes = [
	{ path: "", redirectTo: "home", pathMatch: "full" },
	{ path: "home", component: HomeComponent },
	{ path: "newgroup", component: NuevoGrupoComponent },
	{ path: "updategroup/:id", component: NuevoGrupoComponent},
  { path: "newuser", component: NewuserComponent },
  { path: "updateuser/:id", component: NewuserComponent},
];
