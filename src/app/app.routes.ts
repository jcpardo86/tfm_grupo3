import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FormGroupComponent } from './pages/form-group/form-group.component';
import { GroupViewComponent } from './pages/group-view/group-view.component';
import { authGuard } from './auth/guardAuth.guard';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ResetPasswordComponent } from './components/reset-password-form/reset-password.component';
import { ResetComponent } from './pages/reset-password/reset.component';
import { NewPasswordPageComponent } from './pages/new-password-page/new-password-page.component';
import { GroupListComponent } from './pages/group-list/group-list.component';
import { FormSpentComponent } from './pages/form-spent/form-spent.component';
import { FormUserComponent } from './pages/form-user/form-user.component';
import { UploadButtonComponent } from './components/upload-button/upload-button.component';


export const routes: Routes = [
	{ path: "", redirectTo: "home", pathMatch: "full" },
	{ path: "home", component: HomeComponent },
	{ path: "resetpassword", component: ResetComponent },
	{ path: "reset/:token", component: NewPasswordPageComponent },
	{ path: "newgroup", component: FormGroupComponent, canActivate: [authGuard] },
	{ path: "updategroup/:id", component: FormGroupComponent, canActivate: [authGuard] },
	{ path: "groups", component: GroupListComponent, canActivate: [authGuard] },
	{ path: "group/:_id", component: GroupViewComponent, canActivate: [authGuard] },
	{ path: "newuser", component: FormUserComponent },
	{ path: "updateuser/:id_user", component: FormUserComponent, canActivate: [authGuard] },
	{ path: "newspent/:id_group", component: FormSpentComponent, canActivate: [authGuard] },
	{ path: "updatespent/:id_spent", component: FormSpentComponent, canActivate: [authGuard] },
	{ path: "updateuser/upload/:id_user", component: UploadButtonComponent },
	{ path: "updategroup/upload/:id_group", component: UploadButtonComponent },
	{ path: "newuser/upload/:id_user", component: UploadButtonComponent },

	// Error 404
	{ path: "**", component: PageNotFoundComponent }
];
