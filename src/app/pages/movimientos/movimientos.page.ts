import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  collection,
  Firestore,
  getDocs,
  query,
  where
} from '@angular/fire/firestore';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.page.html',
  styleUrls: ['./movimientos.page.scss'],
  standalone: false
})
export class MovimientosPage implements OnInit {

  movimientos:any[] = [];
  movimientosFiltrados:any[] = [];

  paginaActual = 1;
  registrosPorPagina = 10;

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {}

  async ngOnInit() {
    await this.cargarMovimientos();
  }

  async obtenerDatosIglesia() {

    const user = this.auth.currentUser;

    if (!user) return null;

    const ref = collection(
      this.firestore,
      'Usuario_iglesias'
    );

    const q = query(
      ref,
      where('uid', '==', user.uid)
    );

    const snap = await getDocs(q);

    if (!snap.empty) {
      return snap.docs[0].data();
    }

    return null;
  }

  async cargarMovimientos(){

    const datos = await this.obtenerDatosIglesia();

    if(!datos) return;

    const iglesia = datos['nombre'];

    const ref = collection(
      this.firestore,
      `movimientos/${iglesia}/historial`
    );

    const snap = await getDocs(ref);

    this.movimientos = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    this.movimientosFiltrados = [...this.movimientos];

  }

  buscar(event:any){

    const texto =
      event.target.value?.toLowerCase() || '';

    this.movimientosFiltrados =
      this.movimientos.filter(m =>

        m.nombres?.toLowerCase().includes(texto) ||

        m.apellido1?.toLowerCase().includes(texto) ||

        m.tipoMovimiento?.toLowerCase().includes(texto)

      );

  }

  get movimientosPaginados() {

    const inicio =
      (this.paginaActual - 1)
      * this.registrosPorPagina;

    return this.movimientosFiltrados.slice(
      inicio,
      inicio + this.registrosPorPagina
    );

  }

}