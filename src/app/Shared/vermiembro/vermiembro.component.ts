import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonTitle, IonButtons } from "@ionic/angular/standalone";
import { AgregarMiembroComponent } from '../agregar-miembro/agregar-miembro.component';

@Component({
  selector: 'app-vermiembro',
  templateUrl: './vermiembro.component.html',
  styleUrls: ['./vermiembro.component.scss'],
  standalone: false,
})
export class VermiembroComponent implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  @Input() miembro: any;

  ngOnInit() { }

  cerrar() {
    this.modalCtrl.dismiss();
  }

 

async editar() {

  const modal = await this.modalCtrl.create({
    component: AgregarMiembroComponent,
     cssClass: 'modal-miembro',
    componentProps: {
      miembroE: this.miembro,
      modoEditar: true
    }
  });

  this.modalCtrl.dismiss(); // cierra el modal de ver
  await modal.present();

}
}
