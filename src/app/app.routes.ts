import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FormGroupComponent } from './pages/form-group/form-group.component';
import { GroupViewComponent } from './pages/group-view/group-view.component';
import { UserViewComponent } from './pages/user-view/user-view.component';
import { NewuserComponent } from './pages/newuser/newuser.component';

export const routes: Routes = [


	// {
	// 	path: "",
	// 	loadChildren: () => import("./auth/auth.routes").then(m => m.AUTH_ROUTES)

	// },

	{ path: "", redirectTo: "home", pathMatch: "full" },
	{ path: "home", component: HomeComponent },
	{ path: "newgroup", component:  FormGroupComponent},
	{ path: "updategroup/:id", component: FormGroupComponent },
	{ path: "user/:_id", component: UserViewComponent },
	{ path: "group/:_id", component: GroupViewComponent },
  { path: "newuser", component: NewuserComponent },
  { path: "updateuser/:_id", component: NewuserComponent}
];
