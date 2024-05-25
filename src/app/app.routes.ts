import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FormGroupComponent } from './pages/form-group/form-group.component';
import { GroupViewComponent } from './pages/group-view/group-view.component';
import { UserViewComponent } from './pages/user-view/user-view.component';

export const routes: Routes = [
	{ path: "", redirectTo: "home", pathMatch: "full" },
	{ path: "home", component: HomeComponent },
	{ path: "newgroup", component: FormGroupComponent },
	{ path: "updategroup/:id", component: FormGroupComponent },
	{ path: "user/:_id", component: UserViewComponent },
	{ path: "group/:_id", component: GroupViewComponent },
];
