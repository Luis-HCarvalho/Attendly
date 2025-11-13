import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonMenuButton, IonButtons } from "@ionic/angular/standalone"

@Component({
	selector: 'app-timer',
	templateUrl: './timer.component.html',
	styleUrls: ['./timer.component.scss'],
	standalone: true,
	imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonMenuButton, IonButtons]
})
export class TimerComponent implements OnInit {

	constructor() { }

	ngOnInit() { }

}
