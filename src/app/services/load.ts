  import { Injectable } from '@angular/core';
  import { LoadingController, PopoverController, ToastController } from '@ionic/angular';

  @Injectable({
    providedIn: 'root'
  })
export class Load {
   constructor(public loadingController: LoadingController,
      public toastController: ToastController,
      public popoverController: PopoverController
    ) { }

    async loading(message: string = 'Please wait...', spinnerType: 'bubbles' | 'circles' | 'circular' | 'crescent' | 'dots' | 'lines' | 'lines-small' | 'lines-sharp' | 'lines-sharp-small' = 'crescent') {
      const loading = await this.loadingController.create({
        message: message,
        spinner: spinnerType
      });

      await loading.present();

      return loading;
    }

    async hide(loading: any) {
      await loading.dismiss();
    }

    async toast(message: string, duration: number = 2000, position: 'top' | 'bottom' | 'middle' = 'top', color: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'medium' | 'dark' = 'primary', icon: string = '') {
      const toast = await this.toastController.create({
        message: message,
        duration: duration,
        position: position,
        color: color,
        icon: icon,
        cssClass: 'toast-class',
      });

      await toast.present();
    }
}
