import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { 
	ToastController, 
	ModalController,
	IonIcon,
	IonButton,
	IonInput,
	IonItem,
	IonLabel,
	IonContent,
	IonTextarea,
	IonSelect,
	IonSelectOption,
	IonDatetimeButton,
	IonDatetime,
	IonModal,
} from '@ionic/angular/standalone';
import { DocumentData } from 'firebase/firestore/lite';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user/user-service';

interface BeltColor {
	name: string;
	color: string;
	maxStripes: number;
}

interface Category {
	id: string;
	name: string;
	ageRange: string;
}

@Component({
	selector: 'app-create',
	templateUrl: './create-user.component.html',
	styleUrls: ['./create-user.component.scss'],
	standalone: true,
	imports: [
		IonIcon,
		IonButton,
		IonInput,
		IonItem,
		IonLabel,
		IonContent,
		IonTextarea,
		IonSelect,
		IonSelectOption,
		CommonModule,
		IonDatetimeButton,
		IonDatetime,
		ReactiveFormsModule,
		IonModal,
	]
})
export class CreateUserComponent implements OnInit, OnDestroy {
	@Input() userData!: DocumentData;
	userForm: FormGroup;
	profileImg: string | null = null;
	categories: Category[] = [
		{ id: 'kids1', name: 'Kids 1', ageRange: '<= 8 anos' },
		{ id: 'kids2', name: 'Kids 2', ageRange: '> 9 anos' },
		{ id: 'kids3', name: 'Kids 3', ageRange: 'Adulto' },
	];
	beltColors: BeltColor[] = [
		{ name: 'White', color: '#FFFFFF', maxStripes: 4 },
		{ name: 'Grey', color: '#9CA3AF', maxStripes: 4 },
		{ name: 'Yellow', color: '#FCD34D', maxStripes: 4 },
		{ name: 'Orange', color: '#FB923C', maxStripes: 4 },
		{ name: 'Green', color: '#4ADE80', maxStripes: 4 },
		{ name: 'Blue', color: '#60A5FA', maxStripes: 4 },
		{ name: 'Purple', color: '#A78BFA', maxStripes: 4 },
		{ name: 'Brown', color: '#92400E', maxStripes: 4 },
		{ name: 'Black', color: '#000000', maxStripes: 6 },
		// { name: 'Red/Black', color: 'linear-gradient(90deg, #EF4444 50%, #000000 50%)', maxStripes: 0 },
		// { name: 'Red/White', color: 'linear-gradient(90deg, #EF4444 50%, #FFFFFF 50%)', maxStripes: 0 },
		// { name: 'Red', color: '#EF4444', maxStripes: 0 }
	];
	stripeOptions: number[] = [];


	constructor(
		private fb: FormBuilder,
		private toastCtrl: ToastController,
		private modalCtrl: ModalController,
		private SUser: UserService
	) {
		this.userForm = this.fb.group({
			fullName: ['', [Validators.required, Validators.minLength(3)]],
			email: ['', [Validators.email]],
			phone: ['', [Validators.pattern(/^[0-9]{10,15}$/)]],
			dateOfBirth: [''],
			beltColor: ['', Validators.required],
			stripes: [0, [Validators.required, Validators.min(0)]],
			category: ['', Validators.required],
			emergencyContact: [''],
			emergencyPhone: ['', Validators.pattern(/^[0-9]{10,15}$/)],
			notes: [''],
			uid: ['']
		});
	}

	get fullName() { return this.userForm.get('fullName'); }
	get email() { return this.userForm.get('email'); }
	get phone() { return this.userForm.get('phone'); }
	get dateOfBirth() { return this.userForm.get('dateOfBirth'); }
	get beltColor() { return this.userForm.get('beltColor'); }
	get stripes() { return this.userForm.get('stripes'); }
	get category() { return this.userForm.get('category'); }
	get emergencyContact() { return this.userForm.get('emergencyContact'); }
	get emergencyPhone() { return this.userForm.get('emergencyPhone'); }

	sub: Subscription;
	ngOnInit() {
		this.sub = this.userForm.get('beltColor')?.valueChanges.subscribe((beltName) => {
			this.updateStripeOptions(beltName);
		});
		if (this.userData)
			this.userForm.patchValue(this.userData);
	}

	ngOnDestroy() {
		this.sub.unsubscribe()
	}

	updateStripeOptions(beltName: string) {
		const belt = this.beltColors.find(b => b.name === beltName);
		if (!belt) return;

		this.stripeOptions = Array.from({ length: belt.maxStripes + 1 }, (_, i) => i);
		const currentStripes = this.userForm.get('stripes')?.value;
		if (currentStripes > belt.maxStripes)
			this.userForm.patchValue({ stripes: 0 });
	}

	async onImageSelect(event: any) {
		const file = event.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e: any) => { this.profileImg = e.target.result; };
		reader.readAsDataURL(file);
	}

	removeImage() {
		this.profileImg = null;
	}

	getBeltStyle(beltName: string): any {
		const belt = this.beltColors.find(b => b.name === beltName);
		// if (belt?.color.includes('gradient'))
		// 	return { background: belt.color };
		
		return { 'background-color': belt?.color };
	}

	async onSubmit() {
		if (!this.userForm.valid) {
			const toast = await this.toastCtrl.create({
				message: 'Please fill in all required fields correctly',
				duration: 2500,
				color: 'danger',
				position: 'top'
			});
			await toast.present();

			Object.keys(this.userForm.controls).forEach(key => {
				const control = this.userForm.get(key);
				control?.markAsTouched();
			});
			return;
		}

		this.SUser.setStudent(this.userForm.value).then(() => {
			this.modalCtrl.dismiss({
				created: true,
				data: this.userForm.value
			});
			this.resetForm();
		}).catch(async err => {
			const toast = await this.toastCtrl.create({
				message: err,
				duration: 2500,
				color: 'danger',
				position: 'top'
			});
			await toast.present();
		})
	}

	resetForm() {
		this.userForm.reset();
		this.profileImg = null;
		this.stripeOptions = [];
	}
}
