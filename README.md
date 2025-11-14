# Firebase

This project relies hevily on firebase infrastructure so, it goes without 
saying that a firebase project is needed to quick start this application.

For testing or deployment of the web app version, include a firebase web app 
configuration data in `environments/environment.ts` file, similar to the js 
snippet below.

```js
export const environment = {
	firebaseConfig: {
		apiKey: <apiKey>,
		authDomain: <authDomain>,
		projectId: <projectId>,
		storageBucket: <storageBucket>,
		messagingSenderId: <messagingSenderId>,
		appId: <appId>
	}
};
```