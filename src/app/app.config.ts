import { ApplicationConfig } from "@angular/core";
import { routes } from './app.routes';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, indexedDBLocalPersistence, initializeAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { Capacitor } from '@capacitor/core';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
    providers: [
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		provideIonicAngular(),
		provideRouter(routes, withPreloading(PreloadAllModules)),
		provideFirebaseApp(() => {
            const app = initializeApp(environment.firebaseConfig);
            if (Capacitor.isNativePlatform())
                initializeAuth(app, { persistence: indexedDBLocalPersistence })

            return app;
        }),
		provideAuth(() => getAuth()),
		provideFirestore(() => getFirestore()),
    ]
};
