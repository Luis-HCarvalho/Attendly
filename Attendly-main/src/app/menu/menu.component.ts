import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
	IonButtons,
	IonContent,
	IonHeader,
	IonMenu,
	IonMenuButton,
	IonTitle,
	IonToolbar,
	IonRouterOutlet,
	NavController,
	MenuController,
	IonList,
	IonItem,
	IonLabel
} from '@ionic/angular/standalone';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.scss'],
	standalone: true,
	imports: [
		IonButtons, 
		IonMenuButton, 
		IonContent, 
		IonHeader, 
		IonMenu, 
		IonTitle, 
		IonToolbar, 
		IonRouterOutlet,
		IonList,
		IonItem,
		IonLabel
	],
})
export class MenuComponent implements OnInit {

	constructor(
		private navCtrl: NavController,
		private menuCtrl: MenuController,
	) {
	}

	ngOnInit() { }

	nav(path: string) {
		this.menuCtrl.close();
		this.navCtrl.navigateRoot([`tabs/${path}`]);
	}
}
