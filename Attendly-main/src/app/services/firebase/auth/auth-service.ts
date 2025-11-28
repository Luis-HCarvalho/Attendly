import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { IUser } from 'src/app/model/IUser';
import { doc, DocumentData, Firestore, setDoc } from '@angular/fire/firestore';
import { Observable, share, startWith, tap } from 'rxjs';
import { FirestoreService } from '../firestore/firestore-service';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private udata?: DocumentData;
	private udataObs?: Observable<DocumentData | undefined>;

	constructor(
		private firestore: Firestore,
		private Sfirestore: FirestoreService
	) {}

	public signUp(email: string, passwd: string, userData: IUser) {
		return new Promise<void>((res, rej) => {
			createUserWithEmailAndPassword(getAuth(), email, passwd)
				.then(userCredential => {
					userData.uid = userCredential.user.uid;
					const ref = doc(this.firestore, `users/${userData.uid}`);
					setDoc(ref, <any>userData)
						.then(() => res())
						.catch(err => {
							console.error(err);
							rej();
						});
				})
				.catch(err => {
					console.error(err);
					rej();
				});
		});
	}

	public signIn(email: string, passwd: string) {
		return signInWithEmailAndPassword(getAuth(), email, passwd);
	}

	private getDataSharedObs(userId: string) {
		if (!this.udataObs) {
			this.udataObs = this.Sfirestore
				.kdoc(this.firestore, `users/${userId}`, [
					share(), 
					tap({
						next: (udata: DocumentData) => { this.udata = udata; },
						error: (err) => { console.error(err) },
						complete: () => { delete this.udata; }
					})
				]);
		}
		return this.udataObs;
	}

	public getDataListener(userId: string) {
		return (this.udata) ? 
			this.getDataSharedObs(userId).pipe(startWith(this.udata)) :
			this.getDataSharedObs(userId);
	}
}
