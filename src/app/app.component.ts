import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { AuthService } from './services/auth';
import type { OverlayEventDetail } from '@ionic/core/components';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
   isAuthPage: boolean = false;
    private alertCtrl = inject(AlertController);

  constructor(public menuController: MenuController,
              public router: Router,
              public AuthService: AuthService,
             
  ) { 

     this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {

        const url = event.urlAfterRedirects;

        const authRoutes = ['/loguear', '/registrar'];

        this.isAuthPage = authRoutes.includes(url);

      });
  }

 /* User(): User {
    return this.loading.getFromLocalStorage('user', {});
  }*/


  closeMenu() {
    this.menuController.close();  // Esto cierra el menú manualmente
  }

async confirmLogout() {

  const alert = await this.alertCtrl.create({
    header: 'Alerta!',
    message: '¿Estás seguro de cerrar sesión?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Cerrar Sesión',
        handler: () => {
         this.cerrarSesion();
        }
      }
    ]
  });

  await alert.present();
}

 setResult(event: CustomEvent<OverlayEventDetail>) {
  
  }

   // Función para cerrar sesión
   cerrarSesion() {
    this.AuthService.logout().then(async () => {
      this.router.navigate(['/loguear']); // Redirige a la página de login
    }).catch((error: any) => {
      console.error('Error al cerrar sesión:', error);
    });

    this.closeMenu(); // Cierra el menú al cerrar sesión
  }
}
