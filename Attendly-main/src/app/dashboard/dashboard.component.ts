import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonMenuButton, IonButtons } from "@ionic/angular/standalone"

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	standalone: true,
	imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonMenuButton, IonButtons]
})
export class DashboardComponent implements OnInit {

	constructor() { }

	ngOnInit() { }

}
