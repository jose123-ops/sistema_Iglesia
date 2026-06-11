import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-trasladar-miembro',
  templateUrl: './trasladar-miembro.component.html',
  styleUrls: ['./trasladar-miembro.component.scss'],
  standalone: false
})
export class TrasladarMiembroComponent implements OnInit {

  @Input() iglesias: any[] = [];

  traslado = {
    iglesiaDestino: '',
    otraIglesia: '',
    motivo: '',
    fecha: new Date().toISOString().substring(0,10)
  };

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  cancelar() {
    this.modalCtrl.dismiss();
  }

  guardar() {

    const destino =
      this.traslado.iglesiaDestino === 'otra'
      ? this.traslado.otraIglesia
      : this.traslado.iglesiaDestino;

    this.modalCtrl.dismiss({
      destino,
      motivo: this.traslado.motivo,
      fecha: this.traslado.fecha
    });

  }

}