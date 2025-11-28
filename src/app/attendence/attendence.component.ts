import { Component, OnInit } from '@angular/core';
import { 
	IonContent, 
	IonHeader, 
	IonToolbar, 
	IonTitle, 
	IonMenuButton, 
	IonButtons,
	IonInfiniteScroll,
	IonInfiniteScrollContent,
	IonList,
	IonItem,
	IonDatetime,
	IonDatetimeButton,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardTitle,
	IonCardSubtitle,
} from "@ionic/angular/standalone"
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatRippleModule } from '@angular/material/core';

@Component({
	selector: 'app-attendence',
	templateUrl: './attendence.component.html',
	styleUrls: ['./attendence.component.scss'],
	standalone: true,
	imports: [
		IonContent, 
		IonHeader, 
		IonToolbar, 
		IonTitle, 
		IonMenuButton, 
		IonButtons,
		IonInfiniteScroll,
		IonInfiniteScrollContent,
		IonList,
		IonItem,
		IonDatetime,
		IonDatetimeButton,
		IonCard,
		IonCardContent,
		IonCardHeader,
		IonCardTitle,
		IonCardSubtitle,
		ScrollingModule,
		MatRippleModule
	]
})
export class AttendenceComponent implements OnInit {
	elements = [1,1, 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
	matRippleColor = "";

	constructor() { }

	ngOnInit() { }
}
