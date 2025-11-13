import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonMenuButton, IonButtons } from "@ionic/angular/standalone"

@Component({
	selector: 'app-attendence',
	templateUrl: './attendence.component.html',
	styleUrls: ['./attendence.component.scss'],
	standalone: true,
	imports: [IonContent, IonHeader, IonToolbar, IonTitle, IonMenuButton, IonButtons]
})
export class AttendenceComponent implements OnInit {

	constructor() { }

	ngOnInit() { }
}
