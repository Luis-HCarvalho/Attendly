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
	IonAvatar,
	ModalController
} from "@ionic/angular/standalone"
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatRippleModule } from '@angular/material/core';
import { CreateUserComponent } from './create/create-user.component';
import { UserService } from '../services/user/user-service';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.scss'],
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
		IonAvatar,
		ScrollingModule,
		MatRippleModule
	]
})
export class UsersComponent {
	users
	constructor(
		private modalCtrl: ModalController,
		private SUser: UserService
	) {
		this.SUser.getStudents().subscribe((data) => {
			this.users = data;
		})
	}

	profileBorder(color: string) {
		return { "border": `2px solid ${color}` }
	}

	async openModal(userData?) {
		const modalOptions = {
			component: CreateUserComponent,
			breakpoints: [0, 0.5, 0.75, 1],
			initialBreakpoint: 1,
		}
		if (userData)
			modalOptions['componentProps'] = { 'userData': userData }

		console.log(JSON.stringify(modalOptions['componentProps']))
		const modal = await this.modalCtrl.create(modalOptions);
		await modal.present();
	}

}
