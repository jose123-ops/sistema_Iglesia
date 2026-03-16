import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AgregarMiembroComponent } from '../../Shared/agregar-miembro/agregar-miembro.component';
import { addDoc, collection, collectionData, collectionGroup, deleteDoc, doc, Firestore, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { VermiembroComponent } from 'src/app/Shared/vermiembro/vermiembro.component';
import { AlertController } from '@ionic/angular';

import jsPDF from 'jspdf';

@Component({
  selector: 'app-miembros',
  templateUrl: './miembros.page.html',
  styleUrls: ['./miembros.page.scss'],
  standalone: false
})
export class MiembrosPage implements OnInit {

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

  async abrirModalAgregar() {

    const modal = await this.modalCtrl.create({
      component: AgregarMiembroComponent,
      cssClass: 'modal-miembro'
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      this.miembros.push(data);
      this.miembrosFiltrados = [...this.miembros];
    }

  }

  async cargarMiembros() {

    const datos = await this.obtenerDatosIglesia();

    if (!datos) return;

    const grupo = datos['nombre']; // 👈 aquí está la clave

    console.log("Grupo del usuario:", grupo);

    const ref = collection(this.firestore, `miembros/${grupo}/lista`);

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

  async correccion(miembro: any) {

    const alert = await this.alertCtrl.create({
      header: 'Tipo de corrección',

      inputs: [

        {
          type: 'radio',
          label: 'Disciplina',
          value: 'disciplina',
          checked: true
        },

        {
          type: 'radio',
          label: 'Cortamiento',
          value: 'cortamiento'
        },

        {
          type: 'radio',
          label: 'Quitar disciplina',
          value: 'quitar_disciplina'
        }

      ],

      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Continuar',
          handler: async (tipo) => {

            await this.pedirMotivo(miembro, tipo);

          }
        }
      ]
    });

    await alert.present();

  }

  async pedirMotivo(miembro: any, tipo: string) {

    const alert = await this.alertCtrl.create({
      header: 'Motivo',

      inputs: [
        {
          name: 'motivo',
          type: 'textarea',
          placeholder: 'Escriba el motivo'
        }
      ],

      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: async (data) => {

            if (tipo === 'disciplina') {
              await this.aplicarDisciplina(miembro, data.motivo);
            }

            if (tipo === 'cortamiento') {
              await this.aplicarCortamiento(miembro, data.motivo);
            }
            if (tipo === 'quitar_disciplina') {
              await this.quitarDisciplina(miembro, data.motivo);
            }


          }
        }

      ]
    });

    await alert.present();

  }
  async aplicarDisciplina(miembro: any, motivo: string) {

    const datos = await this.obtenerDatosIglesia();
    if (!datos) return;

    const grupo = datos['nombre'];

    if (!miembro.id) {
      console.error("El miembro no tiene ID");
      return;
    }

    const ref = doc(this.firestore, 'miembros', grupo, 'lista', miembro.id);

    // alternar estado correctamente
    const nuevoEstado = miembro.estado === 'activo' ? 'disciplina' : 'activo';

    await updateDoc(ref, {
      estado: nuevoEstado,
      observaciones: motivo
    });

    // actualizar en la tabla
    miembro.estado = nuevoEstado;
    miembro.observaciones = motivo;

    console.log("Disciplina aplicada");

  }

  async aplicarCortamiento(miembro: any, motivo: string) {

    const datos = await this.obtenerDatosIglesia();

    if (!datos) return;

    const grupo = datos['nombre'].trim();;

    const datosMiembro = {
      ...miembro,
      observaciones: motivo
    };

    delete datosMiembro.id;

    const refCortados = collection(this.firestore, `miembros_cortados/${grupo}/lista`);

    await addDoc(refCortados, datosMiembro);

    const refOriginal = doc(this.firestore, `miembros/${grupo}/lista/${miembro.id}`);

    await deleteDoc(refOriginal);

    this.miembros = this.miembros.filter(m => m.id !== miembro.id);
    this.miembrosFiltrados = [...this.miembros];

  }

  async quitarDisciplina(miembro: any, motivo: string) {

    const datos = await this.obtenerDatosIglesia();
    if (!datos) return;

    const grupo = datos['nombre'];

    if (!miembro.id) {
      console.error("El miembro no tiene ID");
      return;
    }

    const ref = doc(this.firestore, 'miembros', grupo, 'lista', miembro.id);

    // alternar estado correctamente
    const nuevoEstado = miembro.estado === 'activo' ? 'disciplina' : 'activo';

    await updateDoc(ref, {
      estado: nuevoEstado,
      observaciones: motivo
    });

    // actualizar en la tabla
    miembro.estado = nuevoEstado;
    miembro.observaciones = motivo;

    console.log("Disciplina quitada");

  }


  async generarFicha(miembro: any) {

    const datos = await this.obtenerDatosIglesia();

    let iglesia = "";
    let distrito = "";
    let sector = "";

    if (datos) {
      iglesia = datos['nombre'];
      distrito = datos['distrito'];
      sector = datos['sector'];
    }


    const doc = new jsPDF('p', 'mm', 'letter');

    const img = new Image();
    img.src = 'assets/icon/expediente.jpg';

    img.onload = () => {

      // Imagen de fondo
      doc.addImage(img, 'JPG', 0, 0, 216, 279);

      doc.setFont("times", "bold");
      doc.setFontSize(12);
      doc.setTextColor(70, 70, 70);

      // IGLESIA
      doc.text(iglesia, 35, 50);

      // DISTRITO
      doc.text(distrito, 177, 50);

      // SECTOR
      doc.text(sector, 175, 58);



      // DATOS GENERALES
      doc.text(miembro.nombres || "", 42, 76);

      doc.text(miembro.apellido1 || "", 50, 90);

      doc.text(miembro.apellido2 || "", 150, 90);

      doc.text(miembro.cedula || "", 47, 100);

      doc.text(miembro.nacimiento || "", 95, 110);

      doc.text(miembro.nacionalidad || "", 177, 111);

      doc.text(miembro.estadoCivil || "", 50, 120);

      doc.text(miembro.nivelAcademico || "", 80, 132);

      doc.text(miembro.profesion || "", 183, 131);

      doc.text(miembro.trabajo || "", 65, 141);

      doc.text(miembro.telTrabajo || "", 170, 128);

      doc.text(miembro.conyugue || "", 77, 152);

      doc.text(miembro.direccion || "", 68, 161);

      doc.text(miembro.telefono || "", 44, 180);

      // DATOS ESPIRITUALES
      doc.text(miembro.fechaConversion || "", 30, 203);

      doc.text(miembro.bautismoAgua || "", 105, 203);

      doc.text(miembro.bautismoEspiritu || "", 165, 203);

      doc.text(miembro.estudiosTeologicos || "", 75, 212);

      doc.text(miembro.observaciones || "", 47, 230);

      doc.text(miembro.sociedad, 155, 101);

      doc.text(miembro.nohijos, 190, 152);

      doc.save(`Expediente_${miembro.nombres}.pdf`);

    };

  }
}
