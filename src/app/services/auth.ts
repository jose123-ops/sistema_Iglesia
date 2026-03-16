import { Injectable, EnvironmentInjector, runInInjectionContext } from '@angular/core';

import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';

import {
  Firestore,
  doc,
  setDoc
} from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private injector: EnvironmentInjector
  ) {}

  async registrar(data: any) {

    // 🔥 1️⃣ Crear usuario en Authentication
    const userCredential = await createUserWithEmailAndPassword(
      this.auth,
      data.email,
      data.password
    );

    const uid = userCredential.user.uid;

    // 🔥 2️⃣ Formatear nombre iglesia
    const iglesiaId = this.formatearNombre(data.nombre);

    // 🔥 3️⃣ Crear documento en colección "iglesias"
    await setDoc(
      doc(this.firestore, 'Usuario_iglesias', iglesiaId),
      {
        uid,
        nombre: data.nombre,
        distrito: data.distrito,
        sector: data.sector,
        email: data.email,
        createdAt: new Date()
      }
    );
     (document.activeElement as HTMLElement)?.blur();
     // 🔥 Redirigir al login
  await this.router.navigate(['/loguear']);
  }

  logout() {
     return runInInjectionContext(this.injector, async () => {
    return signOut(this.auth);
    });
    
  }
   
     

 
 private formatearNombre(nombre: string | undefined): string {
  if (!nombre) {
    throw new Error('El nombre de la iglesia es obligatorio');
  }

  return nombre
    .toLowerCase()
    .replace(/\s+/g, '_')
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
// 🔥 Método de login// 

async login(email: string, password: string) {
  try {

     return runInInjectionContext(this.injector, async () => {

    const userCredential = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    if (!userCredential.user) {
      throw new Error('No se pudo autenticar');
    }

    (document.activeElement as HTMLElement)?.blur();

    return this.router.navigate(['/miembros']);

  });
  } catch (error: any) {
    console.error(error);
    throw error;
  }
}

}