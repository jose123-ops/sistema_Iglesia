import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MiembrosPageRoutingModule } from './miembros-routing.module';

import { MiembrosPage } from './miembros.page';
import { SharedModule } from 'src/app/Shared/shared-module';
import { AgregarMiembroComponent } from 'src/app/Shared/agregar-miembro/agregar-miembro.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MiembrosPageRoutingModule,
    SharedModule,
    
  ],
  declarations: [MiembrosPage]
})
export class MiembrosPageModule {}
