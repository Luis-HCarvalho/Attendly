import { inject } from '@angular/core';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { Router, Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';

function logged(): Promise<boolean> {
	return new Promise<boolean>((resolve) => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) resolve(true);
            else resolve(false);
            
            unsubscribe();
        });
    });
}

export const routes: Routes = [
	{
		path: "login",
		loadComponent: () => import("./login/login.component").then(c => c.LoginComponent),
		// canActivate: [() => {
		// 	/** If alreqdy logged redirect to BranchesComponent
		// 	 	else open login component*/
		// 	const router = inject(Router);
		// 	return new Promise<boolean>((resolve) => {
		// 		resolve(true)
		// 		logged().then((result: boolean) => {
		// 			result && router && router.navigate(["tabs"]);
		// 			resolve(true)
		// 		})
		// 	});
		// }],
	},
	{
		path: 'tabs',
		component: MenuComponent,
		children: [
			{
				path: "dashboard",
				loadComponent: () => import("./dashboard/dashboard.component").then(c => c.DashboardComponent)
			},
			{
				path: "attendence",
				loadComponent: () => import("./attendence/attendence.component").then(c => c.AttendenceComponent)
			},
			{
				path: "timer",
				loadComponent: () => import("./timer/timer.component").then(c => c.TimerComponent)
			},
			{
				path: '',
				redirectTo: 'attendence',
				pathMatch: 'full',
			}
		],
		// canActivate: [() => {
		// 	const router = inject(Router);
		// 	return new Promise<boolean>((resolve) => {
		// 		logged().then((result: boolean) => {
		// 			if (result) {
		// 				resolve(true);
		// 			} else {
		// 				router && router.navigate(["login"]);
		// 				resolve(false);
		// 			}
		// 		})
		// 	});
		// }],
	},
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full',
	},
];
