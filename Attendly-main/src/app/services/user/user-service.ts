import { Injectable } from '@angular/core';
import { collection, doc, DocumentData, Firestore, setDoc } from '@angular/fire/firestore';
import { FirestoreService } from '../firebase/firestore/firestore-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
	constructor(
		private firestore: Firestore,
		private SFirestore: FirestoreService
	) {}

	setStudent(userData) {
		let ref;
		if (userData.uid) {
			ref = doc(this.firestore, `students/${userData.uid}`);
		} else {
			ref = doc(collection(this.firestore, `students`));
			userData.uid = ref.id;
		}
		return setDoc(ref, <DocumentData>userData);
	}

	getStudents() {
		const ref = collection(this.firestore, `students`);
		return this.SFirestore.kcollection(ref);
	}


}
