import { Component, inject, Input, OnInit } from '@angular/core';
import { Auth, authState, idToken } from '@angular/fire/auth';
import { addDoc, collection, doc, Firestore, getDoc, getDocs, query, where,updateDoc } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';
import { IonItem, IonHeader, IonToolbar, IonCol } from "@ionic/angular/standalone";
import { firstValueFrom } from 'rxjs';
import { Load } from 'src/app/services/load';

@Component({
  selector: 'app-agregar-miembro',
  templateUrl: './agregar-miembro.component.html',
  styleUrls: ['./agregar-miembro.component.scss'],
  standalone: false,
})
export class AgregarMiembroComponent implements OnInit {

@Input() miembroE:any;
@Input() modoEditar:boolean=false;

  grupoUsuario = "";;
  miembro = {
    id: '',
    nombres: '',
    apellido1: '',
    apellido2: '',
    cedula: '',
    sociedad: '',
    nacimiento: '',
    nacionalidad: '',
    trabajo: '',
    telTrabajo: '',
    conyugue: '',
    nohijos: '',
    direccion: '',
    telefono: '',
    fechaConversion: '',
    bautismoAgua: '',
    bautismoEspiritu: '',
    estudiosTeologicos: '',
    observaciones: '',
    estadoCivil: '',
    nivelAcademico: '',
    profesion: '',
    estado: 'activo',
  };


  constructor(private modalCtrl: ModalController,
    private firestore: Firestore,
    private auth: Auth,
      public service: Load,

  ) { }

  async ngOnInit() {
if(this.modoEditar && this.miembroE){

this.miembro = {...this.miembroE};

}


    this.grupoUsuario = await this.obtenerNombreGrupo();
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  async obtenerNombreGrupo() {

    const user = this.auth.currentUser;

    if (!user) return null;

    const ref = collection(this.firestore, 'Usuario_iglesias');

    const q = query(ref, where('uid', '==', user.uid));

    const snap = await getDocs(q);

    if (!snap.empty) {

      const datos = snap.docs[0].data();



      return datos['nombre'];

    }

    return null;

  }

 async guardar() {

const grupo = await this.obtenerNombreGrupo();

if(!grupo) return;

try {

if(this.modoEditar){

const ref = doc(this.firestore, `miembros/${grupo}/lista/${this.miembro.id}`);


await updateDoc(ref, this.miembro);

this.showToastActualizar();

this.modalCtrl.dismiss(this.miembro);

}else{

const ref = collection(this.firestore, `miembros/${grupo}/lista`);

const docRef = await addDoc(ref, {
...this.miembro,
estado:'activo'
});

// 👇 agregar el id al objeto
const nuevoMiembro = {
...this.miembro,
id: docRef.id,
estado:'activo'
};

this.showToast();

// 👇 enviar el miembro con id al modal
this.modalCtrl.dismiss(nuevoMiembro);

}

} catch(error){
console.error(error);
}

}

  showToast() {
    this.service.toast('Usuario registrado con éxito', 3000, 'middle', 'success', 'checkmark-circle-outline');

  }
  
    showToastActualizar() {
    this.service.toast('Usuario actualizado con éxito', 3000, 'middle', 'success', 'checkmark-circle-outline');

  }


}
