import { Injectable } from '@angular/core';
import { doc, docData, DocumentData, Firestore, setDoc } from '@angular/fire/firestore';
import { Observable, Subject, takeUntil } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class FirestoreService {
	private killSwitch: Subject<void> = new Subject();

	constructor() {}

	/**
	 * Should be called to unsubscribe from all subscriptions made as: 
	 * <observable>.pipe(takeUntil(<killSwitch Subject triggers>)
	 */
	kill() {
		this.killSwitch.next()
	}

	/**
	 * @return a killable doc data observable
	 */
	kdoc(firestore: Firestore, path: string, f?: any): Observable<DocumentData | undefined> {
		const ref = doc(firestore, path);
		if (!f)
			return docData(ref).pipe(takeUntil(this.killSwitch));
		else
			return [...f].reduce((acc, crr) => {
				return acc.pipe(crr)
			}, docData(ref).pipe(takeUntil(this.killSwitch)))
	}
}
