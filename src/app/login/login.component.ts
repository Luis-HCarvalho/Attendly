import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
	IonButton, 
	IonIcon, 
	ToastController, 
	IonContent, 
	IonInput, 
	IonItem,
	NavController
} from "@ionic/angular/standalone";
import { AuthService } from '../services/firebase/auth/auth-service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	standalone: true,
	imports: [ 
		IonButton, 
		IonIcon, 
		// IonCheckbox,
		IonContent, 
		IonInput, 
		IonItem, 
		CommonModule, 
		ReactiveFormsModule
	]
})
export class LoginComponent {
	loginForm: FormGroup;
	showPasswd: boolean = false;

	constructor(
		private fb: FormBuilder,
		private toastCtrl: ToastController,
		private SAuth: AuthService,
		private navCtrl: NavController,
	) {
		this.loginForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]],
			rememberMe: [false]
		});

	}

	get email() { return this.loginForm.get('email')?.value; }
	get password() { return this.loginForm.get('password')?.value; }

	togglePasswordVisibility() {
		this.showPasswd = !this.showPasswd;
	}

	async onSubmit() {
		this.SAuth.signIn(this.email, this.password).then(credential => {
			this.navCtrl.navigateForward("/tabs")
		}).catch(async (err) => {
			const toast = await this.toastCtrl.create({
				message: err,
				duration: 2000,
				color: "danger",
				position: 'top'
			});
			await toast.present();
		})
	}
}
