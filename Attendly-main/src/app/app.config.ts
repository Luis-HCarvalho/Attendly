import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideIonicAngular } from '@ionic/angular/standalone';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA809yYIs7mGaqoo2-L0quiHfTaSXyC-kw",
  authDomain: "bjj-attendly.firebaseapp.com",
  projectId: "bjj-attendly",
  storageBucket: "bjj-attendly.firebasestorage.app",
  messagingSenderId: "478086889482",
  appId: "1:478086889482:web:9079655a780c9d29a2dff3"
};

// CONFIGURAÇÃO DO ANGULAR
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideIonicAngular(),

    provideFirebaseApp(() => initializeApp(firebaseConfig)),

    provideAuth(() => getAuth()),

    provideFirestore(() => getFirestore()),
  ]
};
