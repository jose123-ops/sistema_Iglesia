import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { AlertController, ModalController } from '@ionic/angular';
import { AgregarMiembroComponent } from 'src/app/Shared/agregar-miembro/agregar-miembro.component';
import { VermiembroComponent } from 'src/app/Shared/vermiembro/vermiembro.component';

@Component({
  selector: 'app-correcciones',
  templateUrl: './correcciones.page.html',
  styleUrls: ['./correcciones.page.scss'],
  standalone: false
})
export class CorreccionesPage implements OnInit {

  miembros: any[] = [];
  miembrosFiltrados: any[] = [];
  paginaActual = 1;
  registrosPorPagina = 5;

  constructor(
    private modalCtrl: ModalController,
    private firestore: Firestore,
    private auth: Auth,
    private alertCtrl: AlertController
  ) { }

  async ngOnInit() {
    await this.cargarMiembros();

  }

  // 🔎 BUSCAR MIEMBRO
  buscar(event: any) {

    const texto = event.target.value?.toLowerCase() || '';

    this.miembrosFiltrados = this.miembros.filter(miembro =>
      miembro.nombres.toLowerCase().includes(texto) ||
      miembro.apellido1.toLowerCase().includes(texto) ||
      miembro.cedula.toLowerCase().includes(texto)
    );

  }

  get miembrosPaginados() {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    return this.miembrosFiltrados.slice(inicio, fin);
  }

  siguientePagina() {
    if ((this.paginaActual * this.registrosPorPagina) < this.miembrosFiltrados.length) {
      this.paginaActual++;
    }
  }

  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }


  async cargarMiembros() {

    const datos = await this.obtenerDatosIglesia();

    if (!datos) return;

    const grupo = datos['nombre']; // 👈 aquí está la clave

    console.log("Grupo del usuario:", grupo);

    const ref = collection(this.firestore, `miembros_cortados/${grupo}/lista`);

    const snap = await getDocs(ref);

    console.log("Documentos encontrados:", snap.docs.length);

    this.miembros = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    this.miembrosFiltrados = [...this.miembros];

  }

  async obtenerDatosIglesia() {

    const user = this.auth.currentUser;

    if (!user) return null;

    const ref = collection(this.firestore, 'Usuario_iglesias');

    const q = query(ref, where('uid', '==', user.uid));

    const snap = await getDocs(q);

    if (!snap.empty) {

      const datos = snap.docs[0].data();

      return datos;

    }

    return null;

  }

  async verMiembro(miembro: any) {

    const modal = await this.modalCtrl.create({

      component: VermiembroComponent,
      cssClass: 'lg-grand',
      componentProps: {
        miembro: miembro,
      }

    });

    await modal.present();

  }

}
